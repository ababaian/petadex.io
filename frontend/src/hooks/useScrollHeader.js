import { useEffect } from 'react';

export function useScrollHeader() {
  useEffect(() => {
    let lastScroll = 0;
    const header = document.querySelector('.ui-section-header');

    if (!header) return;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      // Don't hide header at the very top of the page
      if (currentScroll <= 0) {
        header.classList.remove('header-hidden');
        return;
      }

      // Scrolling down - hide header
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('header-hidden');
      }
      // Scrolling up - show header
      else if (currentScroll < lastScroll) {
        header.classList.remove('header-hidden');
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}
