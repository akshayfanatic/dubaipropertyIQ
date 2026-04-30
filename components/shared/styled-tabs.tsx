'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface TabConfig {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface StyledTabsProps {
  tabs: readonly TabConfig[] | TabConfig[];
  defaultValue?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

/**
 * StyledTabs - Single source of truth for consistent tab styling across the app
 *
 * Usage:
 * ```tsx
 * <StyledTabs
 *   tabs={[
 *     { value: 'basic', label: 'Basic Info', content: <BasicInfoForm /> },
 *     { value: 'advanced', label: 'Advanced', content: <AdvancedForm /> },
 *   ]}
 *   defaultValue="basic"
 *   onValueChange={(value) => console.log('Tab changed:', value)}
 * />
 * ```
 */
export function StyledTabs({ tabs, defaultValue, className, onValueChange }: StyledTabsProps) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value} onValueChange={onValueChange} className={cn('space-y-4', className)}>
      <TabsList variant="line" className="inline-flex gap-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Button
              variant="ghost"
              className="rounded-md text-lg transition-all duration-200 cursor-pointer data-[state=active]:bg-transparent data-[state=active]:underline-double data-[state=active]:underline-offset-4 data-[state=active]:decoration-2 data-[state=active]:font-semibold hover:bg-transparent"
            >
              {tab.label}
            </Button>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
