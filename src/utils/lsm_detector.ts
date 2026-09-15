/**
 * lsm_detector.ts — Puerto TypeScript de lsm_detector.js
 * Detección de letras estáticas y números del abecedario LSM
 * usando ángulos articulares 3D + scoring por letra.
 */

interface Landmark {
  x: number;
  y: number;
  z: number;
}

const EXT_THR = 155;
const FIST_THR = 100;

const _BEND: Record<string, [number, number, number]> = {
  index: [5, 6, 8],
  middle: [9, 10, 12],
  ring: [13, 14, 16],
  pinky: [17, 18, 20],
};
const _THUMB_BEND: [number, number, number] = [2, 3, 4];
const _FINGER_ORDER = ['thumb', 'index', 'middle', 'ring', 'pinky'];

function v3(lms: Landmark[], a: number, b: number): number[] {
  return [lms[b].x - lms[a].x, lms[b].y - lms[a].y, lms[b].z - lms[a].z];
}
function dot(u: number[], v: number[]): number {
  return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
}
function norm(v: number[]): number {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
}
function ang3(lms: Landmark[], a: number, b: number, c: number): number {
  const u = v3(lms, b, a), vv = v3(lms, b, c);
  const nu = norm(u), nv = norm(vv);
  if (nu < 1e-9 || nv < 1e-9) return 180;
  return (180 / Math.PI) * Math.acos(Math.max(-1, Math.min(1, dot(u, vv) / (nu * nv))));
}
function cross(a: number[], b: number[]): number[] {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

export interface FingerStates {
  thumb: boolean; index: boolean; middle: boolean; ring: boolean; pinky: boolean;
  thumbOut: boolean; thumbBetween: boolean; kpThumbSlot: boolean; pThumbSlot: boolean;
  thumbTouchIndex: boolean; thumbTouchMiddle: boolean;
  thumbInFist: boolean; thumbOverTop: boolean; thumbBelowMcps: boolean; thumbAtLevel: boolean;
  thumbSideIndex: boolean; thumbSideMiddle: boolean; thumbSidePinky: boolean;
  thumbAxial: number; thumbLateralPos: number;
  palmFacingCamera: boolean; palmNormalZ: number;
  uvTouching: boolean; uvClose: boolean; uvSpread: boolean; imGap: number;
  palmOriY: number; fingerOriY: number; fingerOriZ: number; orientationY: number;
  handUp: boolean; handDown: boolean; handForward: boolean;
  pChartPose: boolean; fistTight: boolean; palmFlat: boolean;
  ang: Record<string, number>;
}

export function fingerStates(lms: Landmark[] | null): FingerStates | null {
  if (!lms || lms.length < 21) return null;

  const ang: Record<string, number> = {};
  for (const [name, [a, b, c]] of Object.entries(_BEND))
    ang[name] = ang3(lms, a, b, c);
  ang.thumb = ang3(lms, ..._THUMB_BEND);

  const ext: Record<string, boolean> = {};
  for (const name of Object.keys(_BEND))
    ext[name] = ang[name] >= EXT_THR;

  const ax2 = lms[9].x - lms[0].x, ay2 = lms[9].y - lms[0].y;
  const palm2d = Math.hypot(ax2, ay2) || 1e-9;
  const lx = -ay2 / palm2d, ly = ax2 / palm2d;
  const tx = lms[4].x - lms[0].x, ty = lms[4].y - lms[0].y;
  const thumbLat = Math.abs(tx * lx + ty * ly) / palm2d;
  let thumbOut = thumbLat > 0.42;
  ext.thumb = (ang.thumb >= EXT_THR) || thumbOut;

  const d3norm = norm(v3(lms, 0, 9)) || palm2d;
  const thumbTouchIndex = norm(v3(lms, 4, 8)) < d3norm * 0.30;
  const thumbTouchMiddle = norm(v3(lms, 4, 12)) < d3norm * 0.30;
  if (thumbTouchIndex || thumbTouchMiddle) { ext.thumb = false; thumbOut = false; }

  const imGap = norm(v3(lms, 8, 12)) / palm2d;
  const uvTouching = imGap < 0.14;
  const uvClose = imGap < 0.38;
  const uvSpread = imGap > 0.45;

  const palmVec = v3(lms, 0, 9);
  const palmLen = norm(palmVec) || 1e-9;
  const palmOriY = palmVec[1] / palmLen;
  const fi = [
    (lms[8].x + lms[12].x) * 0.5 - lms[0].x,
    (lms[8].y + lms[12].y) * 0.5 - lms[0].y,
    (lms[8].z + lms[12].z) * 0.5 - lms[0].z,
  ];
  const flen = norm(fi) || 1e-9;
  const fingerOriY = fi[1] / flen;
  const fingerOriZ = fi[2] / flen;
  const orientationY = (ext.index && ext.middle) ? fingerOriY : palmOriY;
  const handUp = orientationY < -0.46;
  const handDown = orientationY > 0.46;
  const handForward = fingerOriZ < -0.18;

  const fistTight = Object.keys(_BEND).every(k => ang[k] < FIST_THR);
  const palmFlat = Object.keys(_BEND).every(k => ang[k] > EXT_THR + 5);

  const palmAx = palmVec.map(x => x / palmLen);
  const tVec = [lms[4].x - lms[0].x, lms[4].y - lms[0].y, lms[4].z - lms[0].z];
  const tAxial = dot(tVec, palmAx) / palmLen;
  const thumbBetween = (0.35 < tAxial && tAxial < 0.92) && !thumbOut;
  const kpThumbSlot = ext.thumb && ext.index && ext.middle
    && (-1.28 < tAxial && tAxial < 0.96)
    && !thumbTouchIndex && !thumbTouchMiddle;
  const indexAboveWrist = lms[8].y < (lms[0].y - 0.010);
  const pChartPose = ext.index && ext.middle && kpThumbSlot && indexAboveWrist;

  const mcpMid = [lms[9].x, lms[9].y, lms[9].z];
  const tipRel = [lms[4].x - mcpMid[0], lms[4].y - mcpMid[1], lms[4].z - mcpMid[2]];
  const thumbAxial = dot(tipRel, palmAx) / palmLen;

  const palmLatRaw = [lms[5].x - lms[17].x, lms[5].y - lms[17].y, lms[5].z - lms[17].z];
  const latLen = norm(palmLatRaw) || 1e-9;
  const palmLatU = palmLatRaw.map(x => x / latLen);
  const thumbLateralPos = dot(tipRel, palmLatU) / palmLen;

  const pThumbSlot = ext.index && ext.middle && !thumbOut
    && !thumbTouchIndex && !thumbTouchMiddle
    && !fistTight && thumbLateralPos > 0.0;

  const v1 = v3(lms, 0, 5), v2 = v3(lms, 0, 17);
  const normal = cross(v1, v2);
  const nlen = norm(normal) || 1e-9;
  const palmNormalZ = normal[2] / nlen;
  const palmFacingCamera = Math.abs(palmNormalZ) > 0.45;

  const thumbInFist = fistTight && !thumbOut && palmFacingCamera;
  const thumbOverTop = thumbInFist && thumbAxial > +0.30;
  const thumbBelowMcps = thumbInFist && thumbAxial < -0.05;
  const thumbAtLevel = thumbInFist && thumbAxial >= -0.05 && thumbAxial <= +0.30;
  const thumbSideIndex = thumbInFist && thumbLateralPos > +0.10;
  const thumbSideMiddle = thumbInFist && thumbLateralPos >= -0.10 && thumbLateralPos <= +0.10;
  const thumbSidePinky = thumbInFist && thumbLateralPos < -0.10;

  return {
    thumb: ext.thumb, index: ext.index, middle: ext.middle,
    ring: ext.ring, pinky: ext.pinky,
    thumbOut, thumbBetween, kpThumbSlot, pThumbSlot,
    thumbTouchIndex, thumbTouchMiddle,
    thumbInFist, thumbOverTop, thumbBelowMcps, thumbAtLevel,
    thumbSideIndex, thumbSideMiddle, thumbSidePinky,
    thumbAxial, thumbLateralPos,
    palmFacingCamera, palmNormalZ,
    uvTouching, uvClose, uvSpread, imGap,
    palmOriY, fingerOriY, fingerOriZ, orientationY,
    handUp, handDown, handForward,
    pChartPose, fistTight, palmFlat,
    ang,
  };
}

// ── Extras por letra ──
function extraA(s: FingerStates) { return (s.thumbOut ? +0.12 : -0.10) + (s.fistTight ? +0.06 : -0.08); }
function extraL(s: FingerStates) { return (s.thumbOut ? +0.12 : -0.25) + (s.handUp ? +0.06 : -0.08); }
function extraY(s: FingerStates) {
  if (!s.thumbOut) return -0.22; if (!s.pinky) return -0.20;
  let sc = +0.18; if (s.index) sc -= 0.18; if (s.middle) sc -= 0.18; if (s.ring) sc -= 0.15; return sc;
}
function extraG(s: FingerStates) { if (s.uvClose && s.middle) return -0.30; return s.handUp ? -0.18 : +0.06; }
function extraQ(s: FingerStates) {
  if (s.middle || s.ring || s.pinky) return -0.25;
  return (s.thumbTouchIndex ? +0.24 : -0.30) + (s.handDown ? +0.08 : 0);
}
function extraC(s: FingerStates) { if (s.index || s.middle || s.ring || s.pinky || s.fistTight) return -0.40; return +0.50; }
function extraB(s: FingerStates) { return s.palmFlat ? +0.10 : -0.02; }
function extraO(s: FingerStates) {
  if (s.fistTight) return -0.55; let sc = 0;
  if (s.index) sc -= 0.15; if (s.middle) sc -= 0.10; if (s.ring) sc -= 0.08; if (s.pinky) sc -= 0.08;
  if (s.thumbOut) sc -= 0.30;
  if (s.thumbTouchIndex) sc += 0.35; else if (s.thumbTouchMiddle) sc += 0.10; else sc -= 0.15; return sc;
}
function extraF(s: FingerStates) { return s.thumbTouchIndex ? +0.18 : -0.12; }
function extraD(s: FingerStates) { return (s.thumbTouchMiddle ? +0.12 : -0.06) + (s.handUp ? +0.05 : 0); }
function extraH(s: FingerStates) {
  if (s.ring) return -0.28; if (s.uvSpread) return -0.22; if (s.handDown) return -0.20;
  return (s.uvClose ? +0.18 : +0.05) + (s.handUp ? -0.06 : +0.04);
}
function extraU(s: FingerStates) {
  if (s.uvSpread) return -0.20; if (s.uvTouching) return -0.18; if (s.handDown) return -0.20;
  return (s.uvClose ? +0.16 : -0.10) + (s.handUp ? +0.06 : -0.02);
}
function extraV(s: FingerStates) { if (s.handDown) return -0.15; if (s.pThumbSlot) return -0.30; return s.uvSpread ? +0.14 : -0.18; }
function extraR(s: FingerStates) { if (s.handDown) return -0.15; return s.uvTouching ? +0.15 : -0.15; }
function extraW(s: FingerStates) { if (s.handDown) return -0.25; return (s.handUp ? +0.12 : -0.10); }
function extraX(s: FingerStates) {
  if (s.index) return -0.50; if (s.fistTight) return -0.45;
  let sc = +0.22; if (!s.middle) sc += 0.06; if (!s.ring) sc += 0.06; if (!s.pinky) sc += 0.06; if (!s.thumb) sc += 0.04; return sc;
}
function extraZ(s: FingerStates) {
  if (!s.index) return -0.40; if (s.middle) return -0.22; if (s.ring || s.pinky) return -0.18;
  return +0.20 + (s.thumbOut ? -0.10 : 0);
}
function extraK(s: FingerStates) {
  if (s.thumbTouchMiddle || s.thumbTouchIndex) return -0.38; if (s.uvClose) return -0.35;
  if (!s.kpThumbSlot) return -0.50;
  let d = s.handUp ? -0.28 : s.handDown ? -0.24 : +0.30; d += s.uvSpread ? +0.06 : 0; return d;
}
function extraP(s: FingerStates) {
  if (s.thumbTouchMiddle || s.thumbTouchIndex) return -0.38; if (s.uvClose) return -0.30;
  if (s.thumbOut) return -0.28; if (!s.pThumbSlot) return -0.50; if (s.handDown) return -0.30;
  const upLike = s.handUp || s.pChartPose;
  let d = upLike ? +0.34 : (s.handForward && !s.handUp) ? -0.14 : +0.10; d += s.uvSpread ? +0.06 : 0; return d;
}
function baseFistOk(s: FingerStates) { return (s.thumbOut ? -0.28 : +0.04) + (s.fistTight ? +0.10 : -0.22); }
function extraS(s: FingerStates) {
  const d = baseFistOk(s); if (!s.fistTight) return d - 0.30;
  if (!s.palmFacingCamera) return d + (s.thumbLateralPos > 0.08 ? +0.08 : +0.02);
  if (s.thumbBelowMcps) return d - 0.35; if (s.thumbOverTop) return d - 0.18;
  if (s.thumbSideIndex) return d + 0.14; if (s.thumbAtLevel) return d + 0.08; return d + 0.04;
}
function extraT(s: FingerStates) { const d = baseFistOk(s); if (!s.fistTight) return d - 0.30; return s.thumbOverTop ? d + 0.18 : d - 0.30; }
function scoreMvarA(s: FingerStates) {
  if (s.thumbOut || !s.fistTight) return -0.30; if (!s.palmFacingCamera) return +0.04;
  if (!s.thumbBelowMcps) return -0.10; return s.thumbSidePinky ? +0.18 : +0.06;
}
function scoreMvarB(s: FingerStates) {
  if (s.thumbOut) return -0.25; if (!(s.index && s.middle && s.ring)) return -0.20;
  if (s.pinky) return -0.10; if (s.handUp) return -0.18; return s.handDown ? +0.30 : +0.04;
}
function extraM(s: FingerStates) { return Math.max(scoreMvarA(s), scoreMvarB(s)); }
function scoreNvarA(s: FingerStates) {
  if (s.thumbOut || !s.fistTight) return -0.30; if (!s.palmFacingCamera) return +0.04;
  if (!s.thumbBelowMcps) return -0.10; if (s.thumbSideMiddle) return +0.22; if (s.thumbAtLevel) return +0.12; return +0.06;
}
function scoreNvarB(s: FingerStates) {
  if (s.thumbOut || s.uvSpread) return s.thumbOut ? -0.25 : -0.22;
  if (!(s.index && s.middle)) return -0.20; if (s.ring || s.pinky) return -0.12;
  if (s.handUp) return -0.22; if (!s.handDown) return +0.00; return +0.32;
}
function extraN(s: FingerStates) { return Math.max(scoreNvarA(s), scoreNvarB(s)); }
function extraEnye(s: FingerStates) { return extraN(s) - 0.10; }
function extraE(s: FingerStates) {
  if (!s.fistTight) return -0.50; let d = s.thumbOut ? -0.28 : +0.04;
  if (s.thumbBelowMcps) d -= 0.25; else if (s.thumbOverTop) d -= 0.22; else d += 0.20; return d;
}
function extraI(s: FingerStates) {
  if (!s.pinky) return -0.40; let sc = +0.30;
  if (s.index) sc -= 0.20; if (s.middle) sc -= 0.20; if (s.ring) sc -= 0.20; if (s.thumb) sc -= 0.12; if (s.thumbOut) sc -= 0.20; return sc;
}
function extraN1(s: FingerStates) { if (!s.index) return -0.50; let d = +0.20; if (s.middle) d -= 0.18; if (s.ring) d -= 0.15; if (s.pinky) d -= 0.15; if (s.thumbOut) d -= 0.10; return d; }
function extraN2(s: FingerStates) { if (!(s.index && s.middle)) return -0.45; let d = +0.18; if (s.ring) d -= 0.18; if (s.pinky) d -= 0.18; if (s.thumbOut) d -= 0.06; return d; }
function extraN3(s: FingerStates) { if (!(s.index && s.middle && s.ring)) return -0.45; let d = +0.18; if (s.pinky) d -= 0.18; if (s.thumbOut) d -= 0.10; return d; }
function extraN4(s: FingerStates) { if (!(s.index && s.middle && s.ring && s.pinky)) return -0.45; let d = +0.20; if (s.thumbOut) d -= 0.08; return d; }
function extraN5(s: FingerStates) { const c = +['index', 'middle', 'ring', 'pinky'].filter(k => s[k as keyof FingerStates] as boolean).length; let d = 0.05 * c - 0.15; if (s.thumbOut) d += 0.12; if (c < 4) d -= 0.20; return d; }

const LETTER_EXTRA: Record<string, (s: FingerStates) => number> = {
  '1': extraN1, '2': extraN2, '3': extraN3, '4': extraN4, '5': extraN5,
  'A': extraA, 'B': extraB, 'C': extraC, 'D': extraD, 'E': extraE,
  'F': extraF, 'G': extraG, 'H': extraH, 'I': extraI, 'K': extraK,
  'L': extraL, 'M': extraM, 'N': extraN, 'Ñ': extraEnye, 'O': extraO,
  'P': extraP, 'Q': extraQ, 'R': extraR, 'S': extraS, 'T': extraT,
  'U': extraU, 'V': extraV, 'W': extraW, 'X': extraX, 'Y': extraY, 'Z': extraZ,
};

export function scoreLetter(states: FingerStates | null, template: string, letter: string): number {
  if (!states || !template || template.length !== 5) return 0;
  let ok = 0, nWild = 0;
  for (let i = 0; i < 5; i++) {
    const t = template[i], name = _FINGER_ORDER[i];
    if (t === '?') { ok += 1; nWild++; continue; }
    if (states[name as keyof FingerStates] === (t === 'E')) ok += 1;
  }
  let base = ok / 5;
  if (nWild >= 4) base -= 0.25;
  const fn = LETTER_EXTRA[letter];
  if (fn) base = base + fn(states);
  return Math.max(0, base);
}

export const LSM_ALPHABET: [string, string, boolean][] = [
  ['A', 'ECCCC', false], ['B', 'CEEEE', false], ['C', '?????', false],
  ['D', 'CECCC', false], ['E', 'CCCCC', false], ['F', 'CCEEE', false],
  ['G', 'EECCC', false], ['H', '?EECC', false], ['I', 'CCCCE', false],
  ['J', 'CCCCE', true], ['K', 'EEECC', true], ['L', 'EECCC', false],
  ['M', '?????', false], ['N', '?????', false], ['Ñ', '?????', true],
  ['O', 'CCCCC', false], ['P', '?EECC', false], ['Q', 'CCCCC', true],
  ['R', 'CEECC', false], ['S', 'CCCCC', false], ['T', 'CCCCC', false],
  ['U', 'CEECC', false], ['V', 'CEECC', false], ['W', 'CEEEC', false],
  ['X', 'CECCC', true], ['Y', 'ECCCE', false], ['Z', 'CECCC', true],
];

export function detectBestLetter(states: FingerStates | null, hasMotion = false): [string | null, number] {
  if (!states) return [null, 0];
  let best: string | null = null, bestScore = 0;
  for (const [letter, tpl, isMov] of LSM_ALPHABET) {
    let s = scoreLetter(states, tpl, letter);
    if (isMov && hasMotion) s += 0.05;
    else if (isMov) s -= 0.03;
    if (s > bestScore) { bestScore = s; best = letter; }
  }
  return [best, bestScore];
}

// ── Números 6-9 ──
function extraN6(s: FingerStates) {
  if (!s.index || !s.middle || !s.ring) return -0.40; if (!s.pinky) return -0.30;
  if (s.thumbOut) return -0.20; return s.thumbTouchIndex ? -0.10 : +0.20;
}
function extraN7(s: FingerStates) {
  if (!s.index || !s.middle) return -0.40; if (!s.pinky) return -0.10;
  if (s.ring) return -0.20; if (s.thumbOut) return -0.20; return +0.22;
}
function extraN8(s: FingerStates) {
  if (!s.index) return -0.40; if (!s.ring || !s.pinky) return -0.20;
  if (s.middle) return -0.25; if (s.thumbOut) return -0.20; return s.thumbTouchMiddle ? +0.28 : +0.18;
}
function extraN9(s: FingerStates) {
  if (!s.middle || !s.ring || !s.pinky) return -0.40; if (s.index) return -0.30;
  if (s.thumbOut) return -0.20; return s.thumbTouchIndex ? +0.30 : +0.18;
}

Object.assign(LETTER_EXTRA, { '6': extraN6, '7': extraN7, '8': extraN8, '9': extraN9 });

export const NUMBER_TEMPLATES: Record<string, string> = {
  '6': 'CEEEE', '7': 'CEEEC', '8': 'CEECE', '9': 'CECEE',
};

export const MATCH_THR = 0.70;

export function scoreTarget(states: FingerStates | null, targetName: string, template?: string): number {
  if (!states) return 0;
  const tpl = template || NUMBER_TEMPLATES[targetName] || '?????';
  return scoreLetter(states, tpl, targetName);
}
