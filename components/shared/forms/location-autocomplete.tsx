'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLocationAutocomplete, AutocompleteResult } from '@/hooks/data/public/useLocationAutocomplete';

interface LocationAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  onSelect?: (result: AutocompleteResult) => void;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
}

export function LocationAutocomplete({ value = '', onChange, onSelect, placeholder = 'Search e.g Location, Property', className = '', autoComplete = 'on' }: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { results, isLoading } = useLocationAutocomplete(value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setIsOpen(newValue.length >= 2);
    setSelectedIndex(-1);
  };

  const handleSelect = (result: AutocompleteResult) => {
    onChange(result.label);
    setIsOpen(false);
    onSelect?.(result);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : i));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => value.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10"
          autoComplete={autoComplete}
        />
      </div>

      {isOpen && (value.length >= 2 || isLoading) && (
        <div ref={dropdownRef} className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((result, index) => (
                <li
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className={cn('flex cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-accent', selectedIndex === index && 'bg-accent')}
                >
                  {result.type === 'city' ? <MapPin className="h-4 w-4 text-muted-foreground" /> : <Building2 className="h-4 w-4 text-muted-foreground" />}
                  <div className="flex-1">
                    <span className="font-medium">{result.label}</span>
                    {result.city && <span className="ml-2 text-muted-foreground">in {result.city}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{result.type}</span>
                </li>
              ))}
            </ul>
          ) : value.length >= 2 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
