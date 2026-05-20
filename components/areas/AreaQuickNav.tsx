'use client';

import { useEffect, useState } from 'react';
import { HelpCircle, Images, Info, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'general-information', label: 'General Information', icon: Info },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'area-faqs', label: 'Area FAQs', icon: HelpCircle },
  { id: 'amenities-faqs', label: 'Amenities FAQs', icon: HelpCircle },
  { id: 'amenities', label: 'Amenities', icon: Sparkles },
];

const stickyOffset = 144;

export function AreaQuickNav() {
  const [activeTab, setActiveTab] = useState('general-information');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      const offsets = navItems.map((item) => {
        const el = document.getElementById(item.id);
        return { id: item.id, top: el ? el.offsetTop - stickyOffset : -1 };
      });

      const current = offsets.filter((item) => item.top !== -1 && item.top <= scrollY).sort((a, b) => b.top - a.top)[0];

      if (current && current.id !== activeTab) {
        setActiveTab(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    window.scrollTo({
      top: el.offsetTop - stickyOffset,
      behavior: 'smooth',
    });
  };

  return (
    <div className="sticky top-16 z-40 border-b bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-start gap-1 overflow-x-auto scroll-smooth sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const sectionExists = typeof document !== 'undefined' && !!document.getElementById(item.id);

            if (!sectionExists && typeof document !== 'undefined') {
              return null;
            }

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'relative flex h-full shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-[3px] border-transparent px-4 text-[11px] font-bold uppercase tracking-wider transition-all group sm:gap-2 sm:px-6 sm:text-[13px]',
                  isActive ? 'border-primary bg-primary/3 text-primary' : 'text-muted-foreground hover:bg-primary/2 hover:text-primary',
                )}
              >
                <Icon className={cn('h-3.5 w-3.5 text-primary/60 transition-transform group-hover:scale-110 sm:h-4 sm:w-4', isActive && 'text-primary')} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
