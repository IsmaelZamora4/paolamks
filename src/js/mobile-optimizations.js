// ============================================================
// mobile-optimizations.js — Mejoras de UX para dispositivos móviles
// Farmacéuticos Markos — Panel Paola
// ============================================================

(function() {
  'use strict';

  // Detectar si es un dispositivo móvil
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.matchMedia("(max-width: 768px)").matches;
  };

  // Prevenir el zoom doble en el navegador durante el doble tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Mejorar el scrolling en dispositivos móviles (smooth scroll)
  if (isMobile()) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  // Mejoras para formularios en móvil
  const optimizeFormFields = () => {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], textarea, select');
    inputs.forEach(input => {
      // Asegurar que sea clickeable con al menos 44x44px
      const rect = input.getBoundingClientRect();
      if (rect.height < 44) {
        input.style.minHeight = '44px';
      }

      // Prevenir zoom en iOS al hacer focus
      input.addEventListener('focus', () => {
        if (isMobile()) {
          // Desplazarse para evitar el teclado
          setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      });
    });
  };

  // Optimizar botones para móvil
  const optimizeButtons = () => {
    const buttons = document.querySelectorAll('button, [role="button"], a.btn');
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      
      // Asegurar tamaño mínimo de 44x44px para touch
      if (rect.height < 44 || rect.width < 44) {
        const padding = Math.max(44 - rect.height, 44 - rect.width) / 2;
        if (padding > 0) {
          button.style.padding = `${8 + padding}px ${12 + padding}px`;
        }
      }

      // Agregar feedback táctil
      button.addEventListener('touchstart', () => {
        button.style.opacity = '0.7';
      });

      button.addEventListener('touchend', () => {
        button.style.opacity = '1';
      });
    });
  };

  // Mejorar la navegación en móvil (sidebar horizontal)
  const enhanceSidebarNavigation = () => {
    const sidebar = document.querySelector('.sidebar');
    const nav = document.querySelector('.sidebar nav');
    
    if (sidebar && nav && isMobile()) {
      // Agregar scroll horizontal suave
      nav.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          nav.scrollLeft += e.deltaY;
        }
      }, { passive: false });

      // Agregar indicador de scroll
      const updateScrollIndicator = () => {
        if (nav.scrollLeft > 0) {
          nav.style.boxShadow = 'inset -10px 0 10px -10px rgba(0,0,0,0.1)';
        } else {
          nav.style.boxShadow = 'none';
        }
      };

      nav.addEventListener('scroll', updateScrollIndicator);
    }
  };

  // Manejar orientación del dispositivo
  const handleOrientationChange = () => {
    window.addEventListener('orientationchange', () => {
      // Ajustar layout cuando cambia la orientación
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover');
      }

      // Reajustar elementos en landscape
      if (window.innerHeight < 600) {
        document.body.style.overflow = 'hidden';
        const mainContent = document.querySelector('.main');
        if (mainContent) {
          mainContent.style.maxHeight = 'calc(100vh - 60px)';
          mainContent.style.overflowY = 'auto';
          mainContent.style.webkitOverflowScrolling = 'touch';
        }
      } else {
        document.body.style.overflow = 'auto';
      }
    });
  };

  // Mejorar rendimiento del scroll
  const optimizeScrollPerformance = () => {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Operaciones de scroll pueden ir aquí
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  // Prevenir comportamiento de pull-to-refresh en navegadores móviles sin bloquear el scroll nativo
  const preventPullToRefresh = () => {
    document.body.style.overscrollBehaviorY = 'none';
  };

  // Manejar teclado virtual en iOS
  const handleVirtualKeyboard = () => {
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      document.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          // Agregar espaciado bottom para evitar que el teclado cubra el input
          const input = e.target;
          setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      });
      // Se elimina el focusout con window.scrollTo(0,0) porque causaba que la pantalla rebotara hacia arriba al hacer scroll
    }
  };

  // Mejorar modales en móvil
  const optimizeModals = () => {
    const modals = document.querySelectorAll('.modal-content, [role="dialog"]');
    modals.forEach(modal => {
      // Asegurar que los modales sean totalmente visibles
      modal.addEventListener('scroll', () => {
        modal.style.webkitOverflowScrolling = 'touch';
      });
    });
  };

  // Detectar conexión lenta y ajustar experiencia
  const adaptToNetworkConditions = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const checkConnection = () => {
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === '4g') {
          document.body.classList.remove('slow-connection');
        } else if (effectiveType === '3g' || effectiveType === '2g') {
          document.body.classList.add('slow-connection');
          // Desactivar animaciones complejas
          document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
      };

      checkConnection();
      connection.addEventListener('change', checkConnection);
    }
  };

  // Agregar estilos para conexión lenta
  const addSlowConnectionStyles = () => {
    if (document.body.classList.contains('slow-connection')) {
      const style = document.createElement('style');
      style.textContent = `
        * {
          animation-duration: 0s !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Inicializar todas las optimizaciones
  const init = () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (isMobile()) {
          optimizeFormFields();
          optimizeButtons();
          enhanceSidebarNavigation();
          handleOrientationChange();
          optimizeScrollPerformance();
          preventPullToRefresh();
          handleVirtualKeyboard();
          optimizeModals();
          adaptToNetworkConditions();
          addSlowConnectionStyles();
        }
      });
    } else {
      if (isMobile()) {
        optimizeFormFields();
        optimizeButtons();
        enhanceSidebarNavigation();
        handleOrientationChange();
        optimizeScrollPerformance();
        preventPullToRefresh();
        handleVirtualKeyboard();
        optimizeModals();
        adaptToNetworkConditions();
        addSlowConnectionStyles();
      }
    }
  };

  // Ejecutar inicialización
  init();

  // Exportar para uso global si es necesario
  window.MobileOptimizations = {
    isMobile,
    optimizeFormFields,
    optimizeButtons,
    enhanceSidebarNavigation
  };
})();
