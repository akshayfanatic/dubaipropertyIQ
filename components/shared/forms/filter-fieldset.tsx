'use client';

import { ReactNode } from 'react';

interface FilterFieldSetProps {
  children: ReactNode;
  className?: string;
  mobileStack?: boolean;
}

/**
 * Responsive fieldset wrapper for filter controls.
 * - Stacks vertically on mobile (default)
 * - Rows horizontally on sm breakpoint (640px)
 */
export function FilterFieldSet({ children, className = '', mobileStack = true }: FilterFieldSetProps) {
  const baseClasses = 'flex gap-3 items-start';
  const responsiveClasses = mobileStack ? 'flex-col sm:flex-row' : 'flex-row';

  return <div className={`${baseClasses} ${responsiveClasses} ${className}`.trim()}>{children}</div>;
}
