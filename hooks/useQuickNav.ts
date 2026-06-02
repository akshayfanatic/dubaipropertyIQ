'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ComponentType } from 'react';

export type QuickNavItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

type UseQuickNavOptions = {
  items: QuickNavItem[];
  initialActiveId: string;
  stickyOffset: number;
  visibilityThreshold?: number;
};

export function useQuickNav({ items, initialActiveId, stickyOffset, visibilityThreshold }: UseQuickNavOptions) {
  const [activeTab, setActiveTab] = useState(initialActiveId);
  const [visibleItems, setVisibleItems] = useState(items);
  const [isVisible, setIsVisible] = useState(visibilityThreshold === undefined);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisibleItems(items.filter((item) => document.getElementById(item.id)));
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (visibilityThreshold !== undefined) {
        setIsVisible(scrollY > visibilityThreshold);
      }

      const offsets = items.map((item) => {
        const el = document.getElementById(item.id);
        return { id: item.id, top: el ? el.offsetTop - stickyOffset : -1 };
      });

      const current = offsets.filter((item) => item.top !== -1 && item.top <= scrollY).sort((a, b) => b.top - a.top)[0];

      if (current) {
        setActiveTab((previous) => (previous === current.id ? previous : current.id));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [initialActiveId, items, stickyOffset, visibilityThreshold]);

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      window.scrollTo({
        top: el.offsetTop - stickyOffset,
        behavior: 'smooth',
      });
    },
    [stickyOffset],
  );

  return {
    activeTab,
    isVisible,
    scrollToSection,
    visibleItems,
  };
}
