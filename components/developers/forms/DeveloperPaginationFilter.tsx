'use client';

import { Pagination } from '@/components/shared/pagination';

type DeveloperPaginationFilterProps = {
  total: number;
  page: number;
  pageSize: number;
};

export function DeveloperPaginationFilter({ total, page, pageSize }: DeveloperPaginationFilterProps) {
  return <Pagination total={total} page={page} pageSize={pageSize} />;
}
