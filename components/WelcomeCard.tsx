import React, { useState, useEffect, useRef } from 'react';
import { IconX } from './icons/IconX';
import { IconSparkles } from './icons/IconSparkles';

// Define ChevronUp icon locally as creating new files is not supported
const IconChevronUp: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);


const messages = [
  "🌞 Me alegra estar contigo y hacer tu día más agradable.",
  "🙏 Pon tu día en manos de Dios y todo fluirá mejor.",
  "💪 Con Dios de nuestro lado, nada es imposible.",
  "✨ Dios te bendiga en cada paso de tu jornada.",
  "❤️ Trabajar contigo es una bendición.",
  "🚀 Con fe y esfuerzo, alcanzamos grandes logros.",
  "🌟 Dios nos regala un nuevo día para aprovecharlo al máximo.",
  "🙌 Gracias a Dios por la oportunidad de trabajar juntos.",
  "🔥 Tu actitud positiva es un reflejo de la gracia de Dios.",
  "🌻 Cada tarea hecha con amor es servicio a Dios.",
  "🕊️ Dios fortalece tu esfuerzo y multiplica tu paz.",
  "💫 Hoy será un día especial, porque Dios camina contigo.",
  "✨ Con gratitud a Dios, todo se hace más liviano.",
  "💪 Juntos el trabajo se vuelve más ligero.",
  "✨ Trabajar contigo hace la jornada más motivante.",
  "🌟 Tu esfuerzo suma, tu actitud inspira.",
  "❤️ Gracias por dar lo mejor cada día.",
  "🙌 Hoy será un gran día porque lo construimos juntos.",
  "✨ Trabajar a tu lado es una inspiración.",
  "🌞 Hoy hagamos del trabajo un motivo de alegría."
];

const WelcomeCard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [randomMessage, setRandomMessage] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    const timer = setTimeout(() => {
        if (cardRef.current) {
            const initialX = 32; // Margin from the left
            // Position the card just off-screen, so only the handle is visible.
            const initialY = window.innerHeight;
            setPosition({ x: initialX, y: initialY });
        }
    }, 0);

    return () => clearTimeout(timer);

  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (document.body.style.cursor === 'grabbing') {
            document.body.style.cursor = '';
        }
      }
    };

    if (isDragging) {
      document.body.addEventListener('mousemove', handleMouseMove);
      document.body.addEventListener('mouseup', handleMouseUp);
      document.body.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
        setIsDragging(true);
        const rect = cardRef.current.getBoundingClientRect();
        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className="fixed z-50 w-full max-w-sm bg-white dark:bg-secondary-dark rounded-xl shadow-2xl border border-border-light dark:border-border-dark"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      {/* Bouncing chevron handle to indicate presence and interactivity */}
      <div 
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary-dark shadow-lg flex items-center justify-center animate-bounce">
          <IconChevronUp className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div
        className="flex items-center justify-between p-3 border-b border-border-light dark:border-border-dark cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center">
            <IconSparkles className="w-5 h-5 text-primary-light dark:text-primary-dark mr-2"/>
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">¡Bienvenido/a!</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-border-dark text-text-secondary-light dark:text-text-secondary-dark"
          aria-label="Cerrar tarjeta de bienvenida"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-center text-text-primary-light dark:text-text-primary-dark text-lg font-medium">
          "{randomMessage}"
        </p>
      </div>
    </div>
  );
};

export default WelcomeCard;