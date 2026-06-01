'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { toggleSavedProperty } from '@/lib/db/properties/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PropertySaveButtonProps {
  propertyId: string;
  initialSaved?: boolean;
  className?: string;
  iconClassName?: string;
}

export function PropertySaveButton({ propertyId, initialSaved = false, className, iconClassName }: PropertySaveButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const previousSaved = saved;
      setSaved(!previousSaved);

      const result = await toggleSavedProperty(propertyId);

      if (!result.success) {
        setSaved(previousSaved);

        if (result.error?.code === 'UNAUTHENTICATED') {
          toast.info('Log in to save properties');
          router.push(`/auth/login?redirectTo=${encodeURIComponent(pathname)}`);
          return;
        }

        toast.error(result.message || 'Failed to update saved property');
        return;
      }

      const nextSaved = result.data?.saved ?? !previousSaved;
      setSaved(nextSaved);
      toast.success(nextSaved ? 'Property saved' : 'Property removed');
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={saved ? 'Remove from saved properties' : 'Save property'}
      aria-pressed={saved}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        'h-9 w-9 cursor-pointer rounded-none border-0 bg-transparent p-0 text-white shadow-none transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 hover:bg-transparent hover:text-white active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70',
        isPending && 'scale-95',
        className,
      )}
    >
      <Heart
        className={cn(
          'size-8 drop-shadow transition-colors duration-200',
          saved ? 'fill-primary stroke-primary animate-in zoom-in-75' : 'fill-transparent stroke-white',
          isPending && 'opacity-70',
          iconClassName,
        )}
      />
    </Button>
  );
}
