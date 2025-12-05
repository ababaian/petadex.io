import { useEffect } from 'react';

export function useScrollHeader() {
  useEffect(() => {
    let lastScroll = 0;
    let inactivityTimer = null;
    const header = document.querySelector('.ui-section-header');

    if (!header) return;

    const hideHeader = () => {
      const currentScroll = window.pageYOffset;
      // Only hide if not at the very top
      if (currentScroll > 100) {
        header.classList.add('header-hidden');
      }
    };

    const showHeader = () => {
      header.classList.remove('header-hidden');
    };

    const resetInactivityTimer = () => {
      // Clear existing timer
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      // Show header on activity
      showHeader();

      // Set new timer to hide after 2 seconds of inactivity
      inactivityTimer = setTimeout(hideHeader, 2000);
    };

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      // Don't hide header at the very top of the page
      if (currentScroll <= 0) {
        showHeader();
        return;
      }

      // Scrolling down - hide header
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('header-hidden');
      }
      // Scrolling up - show header and reset inactivity timer
      else if (currentScroll < lastScroll) {
        resetInactivityTimer();
      }

      lastScroll = currentScroll;
    };

    const handleMouseMove = (e) => {
      // Show header if mouse is near the top (within 100px)
      if (e.clientY < 100) {
        resetInactivityTimer();
      }
    };

    // Initial inactivity timer
    resetInactivityTimer();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, []);
}
