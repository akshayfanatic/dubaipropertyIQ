'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
}

export function Pagination({ total, page, pageSize }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const totalPages = Math.ceil(total / pageSize);

  const updateParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || (value === 1 && key === 'page')) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [searchParams, pathname, router],
  );

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {total} results
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => updateParams({ page: 1 })} disabled={page === 1}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => updateParams({ page: page - 1 })} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm tabular-nums min-w-25 text-center">
          Page {page} of {totalPages || 1}
        </span>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => updateParams({ page: page + 1 })} disabled={page >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => updateParams({ page: totalPages })} disabled={page >= totalPages}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
