'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  if (!description) return null;

  // Create an excerpt (approx 3 lines)
  const isLong = description.length > 250;
  const excerpt = isLong ? description.slice(0, 250) + '...' : description;

  return (
    <div className="space-y-4">
      <div className="whitespace-pre-line text-base font-medium leading-8 text-muted-foreground">
        {excerpt}
        {isLong && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="ml-2 cursor-pointer font-extrabold text-primary transition-colors hover:text-primary-700 hover:underline">Read More</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">About this Property</DialogTitle>
                <DialogDescription className="text-base">Full property details and description</DialogDescription>
              </DialogHeader>
              <div className="-mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4">
                <div className="text-muted-foreground text-base leading-relaxed md:leading-loose whitespace-pre-wrap">{description}</div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
