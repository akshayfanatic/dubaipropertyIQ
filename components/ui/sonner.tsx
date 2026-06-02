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
          toast: 'group toast group-[.toaster]:border-border/50 group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:shadow-lg',
          success:
            'group-[.toaster]:border-green-200 group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 dark:group-[.toaster]:border-green-900/30 dark:group-[.toaster]:bg-green-950/50 dark:group-[.toaster]:text-green-200 [&_[data-description]]:text-green-700 dark:[&_[data-description]]:text-green-300',
          error: 'group-[.toaster]:border-destructive/20 group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive [&_[data-description]]:text-destructive/80',
          info: 'group-[.toaster]:border-border/50 group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground',
          warning: 'group-[.toaster]:border-border/50 group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground',
        },
      }}
      position="top-center"
      {...props}
    />
  );
};

export { Toaster };
