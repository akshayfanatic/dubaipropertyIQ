'use client';

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-600 dark:text-green-500" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: 'border-border/50 bg-popover text-popover-foreground shadow-lg',
          success:
            'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200 [&_[data-description]]:text-green-700 dark:[&_[data-description]]:text-green-300',
          error: 'border-destructive/20 bg-destructive/10 text-destructive [&_[data-description]]:text-destructive/80',
          info: 'bg-popover border-border/50 text-popover-foreground',
          warning: 'bg-popover border-border/50 text-popover-foreground',
        },
      }}
      position="top-center"
      {...props}
    />
  );
};

export { Toaster };
