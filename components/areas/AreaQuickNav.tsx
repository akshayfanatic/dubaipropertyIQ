'use client';

import { useEffect, useState } from 'react';
import { Building2, HelpCircle, Images, Info, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'general-information', label: 'General Information', icon: Info },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'area-faqs', label: 'Area FAQs', icon: HelpCircle },
  { id: 'amenities-faqs', label: 'Amenities FAQs', icon: HelpCircle },
  { id: 'amenities', label: 'Amenities', icon: Sparkles },
];

const stickyOffset = 144;

export function AreaQuickNav() {
  const [activeTab, setActiveTab] = useState('general-information');
  const [visibleItems, setVisibleItems] = useState(navItems);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisibleItems(navItems.filter((item) => document.getElementById(item.id)));
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;

      const offsets = navItems.map((item) => {
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
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    window.scrollTo({
      top: el.offsetTop - stickyOffset,
      behavior: 'smooth',
    });
  };

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-[oklch(0.985_0.008_260.47_/_0.92)] shadow-[0_10px_28px_oklch(0.2_0.03_263.61_/_0.06)] backdrop-blur-[18px] backdrop-saturate-[1.18]">
      <div className="mx-auto w-[min(92%,1440px)]">
        <div className="flex min-h-[76px] items-center justify-start gap-2 overflow-x-auto scroll-smooth py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'group relative flex min-h-10 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-transparent py-1 pl-1.5 pr-3 text-[11px] font-extrabold uppercase tracking-[0.07em] transition-[transform,border-color,background-color,box-shadow,color] duration-300 ease-in-out after:absolute after:inset-x-4 after:-bottom-1.5 after:h-0.5 after:origin-center after:scale-x-60 after:rounded-full after:bg-primary after:opacity-0 after:transition-[opacity,transform] after:duration-300 after:ease-in-out hover:-translate-y-px hover:border-primary/15 hover:bg-primary/5 hover:text-primary-800 sm:pr-4 sm:text-xs',
                  isActive && 'border-primary/20 bg-card text-primary-800 shadow-[0_8px_22px_oklch(0.2_0.03_263.61_/_0.08)] after:scale-x-100 after:opacity-100',
                )}
              >
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full bg-primary/8 text-primary transition-[transform,background-color,color] duration-300 ease-in-out group-hover:scale-[1.03] group-hover:bg-primary group-hover:text-primary-foreground sm:size-[30px]',
                    isActive && 'bg-primary text-primary-foreground',
                  )}
                >
                  <Icon className="size-3.5 sm:size-4" strokeWidth={2.4} />
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
