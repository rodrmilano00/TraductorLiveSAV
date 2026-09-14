import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyScreen: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Responsable del tratamiento',
      content: 'Señas a Voces Academy es responsable del tratamiento de sus datos personales. Para cualquier consulta relacionada con el tratamiento de sus datos, puede contactarnos a través de los canales oficiales de la organización.',
    },
    {
      title: '2. Datos biométricos recopilados',
      content: 'Esta aplicación recopila y procesa temporalmente los siguientes datos biométricos con el único fin de facilitar la comunicación:\n\n• Voz: capturada a través del micrófono para transcripción en tiempo real.\n• Imagen: capturada a través de la cámara para la interpretación de lengua de señas mexicana (LSM).\n\nEstos datos se procesan en tiempo real y no se almacenan permanentemente en nuestros servidores.',
    },
    {
      title: '3. Finalidad del tratamiento',
      content: 'Los datos biométricos se utilizan exclusivamente para:\n\n• Transcribir voz a texto en tiempo real.\n• Interpretar señas y convertirlas en texto.\n• Facilitar la comunicación entre personas hablantes y personas sordas.\n• Mostrar la conversación en pantalla durante la sesión activa.\n\nNo utilizamos sus datos para fines comerciales, publicitarios ni de investigación.',
    },
    {
      title: '4. Base legal',
      content: 'El tratamiento de sus datos biométricos se realiza con base en su consentimiento explícito, el cual usted otorga al marcar la casilla de aceptación en la pantalla de inicio. Puede retirar su consentimiento en cualquier momento sin que ello afecte la prestación del servicio.',
    },
    {
      title: '5. Conservación de datos',
      content: 'Los datos biométricos (voz e imagen) se procesan en memoria durante la sesión activa y se eliminan automáticamente al cerrar la conversación. No se almacenan grabaciones de audio, video ni transcripciones una vez finalizada la sesión.',
    },
    {
      title: '6. Derechos ARCO',
      content: 'Usted tiene derecho a:\n\n• Acceder a sus datos personales.\n• Rectificar datos inexactos.\n• Cancelar el tratamiento.\n• Oponerse al tratamiento.\n\nPara ejercer estos derechos, contacte a Señas a Voces Academy a través de sus canales oficiales.',
    },
    {
      title: '7. Seguridad',
      content: 'Implementamos medidas técnicas y organizativas adecuadas para proteger sus datos biométricos contra acceso no autorizado, alteración, pérdida o divulgación. El procesamiento se realiza en dispositivos locales durante la sesión.',
    },
    {
      title: '8. Cambios a esta política',
      content: 'Podemos actualizar esta política de privacidad periódicamente. Le notificaremos cualquier cambio significativo a través de la aplicación. La fecha de última actualización se indica al final de este documento.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="flex items-center gap-4 px-8 py-4 border-b border-muted shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-text-muted hover:text-ink hover:bg-muted rounded-soft transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
        <h1 className="font-display text-xl font-extrabold text-ink">Política de Privacidad</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[640px] mx-auto">
          {/* Intro */}
          <div className="bg-soft-orange border border-soft-orange-border rounded-card p-5 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-soft bg-primary flex items-center justify-center text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 className="font-display text-lg font-bold text-ink">Protección de datos biométricos</h2>
            </div>
            <p className="text-sm text-text-muted" style={{ lineHeight: '1.5' }}>
              Su privacidad es fundamental. Esta política explica cómo recopilamos, usamos y protegemos sus datos de voz e imagen durante el uso de la aplicación.
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-5">
            {sections.map((section, i) => (
              <div key={i} className="bg-card border border-muted rounded-card p-5">
                <h3 className="font-display text-base font-bold mb-2 text-ink">{section.title}</h3>
                <p className="text-sm text-text-muted whitespace-pre-line" style={{ lineHeight: '1.6' }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 mb-4 text-center">
            <p className="text-xs text-text-muted">
              Última actualización: Septiembre 2025 · Señas a Voces Academy
            </p>
          </div>

          {/* Accept button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="btn-press px-10 py-4 bg-primary text-white text-base font-bold rounded-soft"
              style={{ boxShadow: '0 4px 16px rgba(217,119,54,.25)' }}
            >
              Entendido, volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyScreen;
