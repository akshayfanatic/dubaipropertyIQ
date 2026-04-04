'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
  label?: string;
}

export function ResetButton({ onReset, label = 'Reset' }: ResetButtonProps) {
  return (
    <Button variant="ghost" type="button" className="cursor-pointer" onClick={onReset}>
      <RotateCcw className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
