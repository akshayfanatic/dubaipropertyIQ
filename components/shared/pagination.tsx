'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
}

export function Pagination({ total, page, pageSize }: PaginationProps) {
  const [, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
      history: 'push',
    }),
  );

  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.min(Math.max(page, 1), totalPages || 1);

  const updatePage = (nextPage: number) => {
    setPage(nextPage <= 1 ? null : nextPage);
  };

  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {total} results
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => updatePage(1)} disabled={currentPage === 1}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => updatePage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm tabular-nums min-w-25 text-center">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => updatePage(currentPage + 1)} disabled={currentPage >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => updatePage(totalPages)} disabled={currentPage >= totalPages}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
