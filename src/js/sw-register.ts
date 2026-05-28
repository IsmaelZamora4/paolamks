/**
 * Registro profesional del Service Worker para la PWA
 */
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      if (registration.installing) {
        console.log('Service worker instalándose');
      }
    } catch (error) {
      console.error(`Fallo en el registro del Service Worker: ${error}`);
    }
  }
};