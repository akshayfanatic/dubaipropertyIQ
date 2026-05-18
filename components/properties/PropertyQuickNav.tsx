'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Building2, KeyRound, MapPin, Sparkles, HelpCircle } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'developer', label: 'Developer', icon: Building2 },
  { id: 'key-info', label: 'Key Info', icon: KeyRound },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'amenities', label: 'Amenities', icon: Sparkles },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
];

export function PropertyQuickNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px (approx when gallery is gone)
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 600);

      // Simple active tab detection
      const offsets = navItems.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: -1 };
        return { id: item.id, top: el.offsetTop - 120 };
      });

      const current = offsets.filter((o) => o.top !== -1 && o.top <= scrollY).sort((a, b) => b.top - a.top)[0];

      if (current && current.id !== activeTab) {
        setActiveTab(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.offsetTop - 100;
      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-100 transition-all duration-500 transform border-b bg-white/80 backdrop-blur-xl shadow-sm',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-start gap-1 sm:gap-2 h-16 overflow-x-auto no-scrollbar scroll-smooth">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            // Only show tabs for sections that exist on the page
            const sectionExists = typeof document !== 'undefined' && !!document.getElementById(item.id);
            if (!sectionExists && typeof document !== 'undefined') return null;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 h-full text-[11px] sm:text-[13px] uppercase tracking-wider transition-all whitespace-nowrap shrink-0 group border-b-[3px] border-transparent cursor-pointer',
                  isActive ? 'text-primary font-black border-primary bg-primary/3' : 'text-muted-foreground hover:text-primary hover:bg-primary/2 font-bold',
                )}
              >
                <Icon className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110', isActive ? 'text-primary' : 'text-primary/60')} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
