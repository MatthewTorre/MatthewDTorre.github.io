import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setInView(entry.isIntersecting));
    }, { threshold: 0.25, rootMargin: '0px', ...(options || {}) });

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}
