import { useEffect, useRef, useState } from 'react';

export default function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isOverUI, setIsOverUI] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      
      // Check if hovering over interactive UI elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .glass, .neon-border, nav, footer, [data-interactive]');
      setIsOverUI(!!isInteractive);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        /* Hide default cursor everywhere except UI elements */
        body {
          cursor: none;
        }
        
        /* Show default cursor on interactive elements */
        a, button, input, textarea, select, 
        [role="button"], nav, nav *, footer, footer *,
        .glass, .neon-border, [data-interactive] {
          cursor: pointer !important;
        }
        
        input, textarea {
          cursor: text !important;
        }
        
        .cursor-scifi-global {
          pointer-events: none;
          position: fixed;
          width: 40px;
          height: 40px;
          transform: translate(-50%, -50%);
          z-index: 9999;
          opacity: 0.8;
          transition: opacity 0.15s ease;
        }
        
        .cursor-scifi-global.hidden-cursor {
          opacity: 0;
        }
        
        .cursor-scifi-global::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 32px;
          height: 32px;
          border: 2px solid #ecb53e;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px #ecb53e, inset 0 0 10px rgba(0, 255, 255, 0.1);
        }
        .cursor-scifi-global::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: #ecb53e;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px #ecb53e;
        }
        .cursor-scifi-global .crosshair-line {
          position: absolute;
          background: #ecb53e;
          box-shadow: 0 0 4px #ecb53e;
        }
        .cursor-scifi-global .line-top {
          top: 0;
          left: 50%;
          width: 2px;
          height: 8px;
          transform: translateX(-50%);
        }
        .cursor-scifi-global .line-bottom {
          bottom: 0;
          left: 50%;
          width: 2px;
          height: 8px;
          transform: translateX(-50%);
        }
        .cursor-scifi-global .line-left {
          left: 0;
          top: 50%;
          width: 8px;
          height: 2px;
          transform: translateY(-50%);
        }
        .cursor-scifi-global .line-right {
          right: 0;
          top: 50%;
          width: 8px;
          height: 2px;
          transform: translateY(-50%);
        }
      `}</style>
      <div 
        ref={cursorRef} 
        className={`cursor-scifi-global hidden sm:block ${isOverUI ? 'hidden-cursor' : ''}`}
      >
        <span className="crosshair-line line-top" />
        <span className="crosshair-line line-bottom" />
        <span className="crosshair-line line-left" />
        <span className="crosshair-line line-right" />
      </div>
    </>
  );
}
