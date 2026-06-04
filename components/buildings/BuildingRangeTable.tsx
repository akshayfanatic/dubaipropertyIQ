import { formatPriceOrFallback } from '@/lib/utils/price';
import type { BuildingUnitRange } from '@/types/building';

interface BuildingRangeTableProps {
  title: string;
  ranges: BuildingUnitRange[];
}

// Responsive table for unit-level sale and rental ranges.
export function BuildingRangeTable({ title, ranges }: BuildingRangeTableProps) {
  if (ranges.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-base font-extrabold text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-muted/45 text-left text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Min</th>
              <th className="px-4 py-3">Average</th>
              <th className="px-4 py-3">Max</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ranges.map((range) => (
              <tr key={range.unit_type}>
                <td className="px-4 py-3 font-semibold text-foreground">{range.unit_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatPriceOrFallback(range.min)}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{formatPriceOrFallback(range.average)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatPriceOrFallback(range.max)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
