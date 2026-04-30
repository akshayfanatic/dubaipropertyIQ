'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TabConfig {
  /** Unique identifier for the tab */
  value: string;
  /** Display label for the tab */
  label: string;
  /** Content to render when tab is active */
  content: React.ReactNode;
}

interface StyledTab2Props {
  /** Array of tab configurations */
  tabs: readonly TabConfig[] | TabConfig[];
  /** Initially active tab value */
  defaultValue?: string;
  /** Additional CSS classes for the tabs container */
  className?: string;
  /** Callback when tab changes */
  onValueChange?: (value: string) => void;
}

/**
 * StyledTab2 - Clean, minimal tab component with bottom border accent
 *
 * @example
 * ```tsx
 * import { StyledTab2 } from '@/components/shared/styled-tabs-2';
 *
 * const tabs = [
 *   { value: 'dubai', label: 'Dubai', content: <div>Dubai content</div> },
 *   { value: 'abu-dhabi', label: 'Abu Dhabi', content: <div>Abu Dhabi content</div> },
 * ];
 *
 * <StyledTab2
 *   tabs={tabs}
 *   defaultValue="dubai"
 *   onValueChange={(value) => console.log('Active tab:', value)}
 * />
 * ```
 */
export function StyledTab2({ tabs, defaultValue, className, onValueChange }: StyledTab2Props) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value} onValueChange={onValueChange} className={cn('w-full', className)}>
      <TabsList className={cn('inline-flex gap-0 bg-transparent p-0 h-auto rounded-none border-b border-border', 'w-full justify-start overflow-x-auto overflow-y-hidden', 'hide-scrollbar')}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'px-8 py-4 text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap w-fit max-w-fit cursor-pointer',
              'transition-colors bg-transparent border-0 shadow-none rounded-none',
              'data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none data-[state=active]:rounded-none',
              'focus-visible:ring-0 focus-visible:outline-none',
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6 focus-visible:outline-none">
          {tab.content}
        </TabsContent>
      ))}

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        [data-slot="tabs-trigger"] {
          --tw-shadow: 0 0 transparent;
          --tw-shadow-colored: 0 0 transparent;
          box-shadow: 0 0 transparent;
        }
      `}</style>
    </Tabs>
  );
}
