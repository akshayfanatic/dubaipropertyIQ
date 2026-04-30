import { Calculator, Home } from 'lucide-react';
import { AnimateSection } from '@/components/shared/AnimateSection';
import { ToolCard } from '@/components/home/card/ToolCard';

type CalculatorItem = {
  title: string;
  description: string;
  href: string;
  icon: typeof Calculator;
  iconBg: string;
  iconColor: string;
  ringColor: string;
};

const calculators: CalculatorItem[] = [
  {
    title: 'Rent vs Buy Calculator',
    description: 'Compare total costs including DLD fees, mortgage payments, and all Dubai-specific charges',
    href: '/calculators/rent-vs-buy-calculator',
    icon: Calculator,
    iconBg: 'bg-primary/10 dark:bg-primary/20',
    iconColor: 'text-primary',
    ringColor: 'hover:ring-primary/20',
  },
  {
    title: 'Mortgage Calculator',
    description: 'Estimate monthly payments, total interest, and view amortization schedules',
    href: '/calculators/mortgage-calculator',
    icon: Home,
    iconBg: 'bg-chart-2/15 dark:bg-chart-2/25',
    iconColor: 'text-chart-2',
    ringColor: 'hover:ring-chart-2/20',
  },
];

export function ToolsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {calculators.map((calc, index) => (
        <AnimateSection key={calc.title} delay={index * 100}>
          <ToolCard {...calc} />
        </AnimateSection>
      ))}
    </div>
  );
}
