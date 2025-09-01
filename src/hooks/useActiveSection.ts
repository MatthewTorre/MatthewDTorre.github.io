import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[], options?: IntersectionObserverInit) {
  const [active, setActive] = useState<string>(ids[0] || '');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el) => !!el) as any[];

    if (elements.length === 0) return;

    let current: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (visible.length > 0) {
          const top = visible[0].target as HTMLElement;
          const id = top.id;
          if (id && id !== current) {
            current = id;
            setActive(id);
          }
        }
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '0px 0px -30% 0px',
        ...(options || {}),
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, options]);

  return active;
}
