import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PropertyContentCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const PropertyContentCard = ({ title, children, className = '' }: PropertyContentCardProps) => {
  return (
    <Card className={cn('bg-transparent border-none shadow-none', className)}>
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-bold border-l-4 border-primary pl-4 leading-none">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

export default PropertyContentCard;
