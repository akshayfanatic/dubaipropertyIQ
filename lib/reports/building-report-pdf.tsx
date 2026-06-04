import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import { formatPercent, formatPriceOrFallback } from '@/lib/utils/price';
import { readableStreamToArrayBuffer } from '@/lib/utils/pdf';
import type { BuildingUnitRange, BuildingWithRelations } from '@/types/building';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#F7F8FB',
    color: '#172033',
    fontFamily: 'Helvetica',
  },
  cover: {
    padding: 26,
    borderRadius: 16,
    backgroundColor: '#172033',
    color: '#FFFFFF',
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#9DD6C8',
    marginBottom: 9,
  },
  title: {
    fontSize: 26,
    lineHeight: 1.16,
    fontWeight: 700,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 1.55,
    color: '#DDE5F2',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  metaPill: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#26344D',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 700,
  },
  section: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E6EAF2',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 10,
    color: '#172033',
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.65,
    color: '#566277',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailItem: {
    width: '48.5%',
    borderRadius: 9,
    padding: 9,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E6EAF2',
  },
  detailLabel: {
    fontSize: 7,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: '#6D778A',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 9.5,
    lineHeight: 1.35,
    color: '#172033',
    fontWeight: 700,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metric: {
    width: '23.5%',
    minHeight: 62,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F1F5F9',
  },
  metricLabel: {
    fontSize: 7,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#6D778A',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 700,
    color: '#172033',
    lineHeight: 1.25,
  },
  table: {
    borderWidth: 1,
    borderColor: '#E6EAF2',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#172033',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E6EAF2',
  },
  cell: {
    width: '25%',
    paddingVertical: 8,
    paddingHorizontal: 9,
    fontSize: 8.5,
    lineHeight: 1.35,
  },
  headerCell: {
    fontWeight: 700,
    color: '#FFFFFF',
  },
  listGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  tag: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 9,
    backgroundColor: '#EEF7F5',
    color: '#315B52',
    fontSize: 8.5,
    fontWeight: 700,
  },
  noteItem: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: '#566277',
    marginBottom: 5,
  },
  split: {
    flexDirection: 'row',
    gap: 12,
  },
  splitColumn: {
    width: '50%',
  },
  footer: {
    position: 'absolute',
    left: 36,
    right: 36,
    bottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#8994A7',
    fontSize: 8,
  },
});

function reportDate() {
  return new Date().toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function locationLabel(building: BuildingWithRelations) {
  return [building.area?.name, building.city?.name].filter(Boolean).join(', ') || 'Dubai Property IQ';
}

function metricItems(building: BuildingWithRelations) {
  return [
    { label: 'Avg price / sqft', value: formatPriceOrFallback(building.avg_price_per_sqft) },
    { label: 'Area avg / sqft', value: formatPriceOrFallback(building.area_avg_price_per_sqft) },
    { label: 'Rental yield', value: formatPercent(building.rental_yield) },
    { label: 'Total units', value: building.total_units ? building.total_units.toLocaleString('en-AE') : 'Not available' },
    { label: 'Completion', value: building.completion_year ? String(building.completion_year) : 'Not available' },
    { label: 'Building type', value: building.building_type || 'Not available' },
    { label: 'Floors', value: building.total_floors ? `${building.total_floors} floors` : 'Not available' },
    { label: 'Service charge', value: building.service_charge_aed_per_sqft ? `${formatPriceOrFallback(building.service_charge_aed_per_sqft)} / sqft` : 'Not available' },
    { label: 'Demand', value: building.demand_level || 'Not available' },
    { label: 'Overall score', value: typeof building.overall_score === 'number' ? `${building.overall_score}/100` : 'Not available' },
    { label: 'Liquidity score', value: typeof building.liquidity_score === 'number' ? `${building.liquidity_score}/100` : 'Not available' },
    { label: 'Capital growth', value: typeof building.capital_growth_score === 'number' ? `${building.capital_growth_score}/100` : 'Not available' },
    { label: 'Lifestyle score', value: typeof building.lifestyle_score === 'number' ? `${building.lifestyle_score}/100` : 'Not available' },
  ];
}

function truthyDetail(value: string | number | null | undefined) {
  return value !== null && value !== undefined && value !== '';
}

function buildingDetails(building: BuildingWithRelations) {
  return [
    { label: 'Building name', value: building.name },
    { label: 'Slug', value: building.slug },
    { label: 'City', value: building.city?.name },
    { label: 'Area', value: building.area?.name },
    { label: 'Developer', value: building.developer?.name },
    { label: 'Address', value: building.address },
    { label: 'Ownership type', value: building.ownership_type },
    { label: 'Short-term rental', value: building.short_term_rental_potential },
    { label: 'Property types', value: building.property_types.join(', ') },
    { label: 'Photos', value: building.photos.length > 0 ? `${building.photos.length} uploaded` : null },
    { label: 'Latitude', value: building.location?.lat },
    { label: 'Longitude', value: building.location?.lng },
  ].filter((item) => truthyDetail(item.value));
}

function DetailGrid({ building }: { building: BuildingWithRelations }) {
  const details = buildingDetails(building);

  if (details.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Building details</Text>
      <View style={styles.detailsGrid}>
        {details.map((item) => (
          <View key={item.label} style={styles.detailItem}>
            <Text style={styles.detailLabel}>{item.label}</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MetricGrid({ building }: { building: BuildingWithRelations }) {
  return (
    <View style={styles.grid}>
      {metricItems(building).map((item) => (
        <View key={item.label} style={styles.metric}>
          <Text style={styles.metricLabel}>{item.label}</Text>
          <Text style={styles.metricValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

function TransactionSummary({ building }: { building: BuildingWithRelations }) {
  const summary = building.transaction_summary;
  const details = [
    { label: 'Recent sales count', value: summary.recent_sales_count },
    { label: 'Average transaction value', value: typeof summary.average_transaction_value === 'number' ? formatPriceOrFallback(summary.average_transaction_value) : null },
    { label: 'Price trend', value: summary.price_trend },
    { label: 'Notes', value: summary.notes },
  ].filter((item) => truthyDetail(item.value));

  if (details.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Transaction summary</Text>
      <View style={styles.detailsGrid}>
        {details.map((item) => (
          <View key={item.label} style={styles.detailItem}>
            <Text style={styles.detailLabel}>{item.label}</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function RangeTable({ title, ranges }: { title: string; ranges: BuildingUnitRange[] }) {
  if (ranges.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell]}>Unit</Text>
          <Text style={[styles.cell, styles.headerCell]}>Min</Text>
          <Text style={[styles.cell, styles.headerCell]}>Average</Text>
          <Text style={[styles.cell, styles.headerCell]}>Max</Text>
        </View>
        {ranges.map((range) => (
          <View key={range.unit_type} style={styles.tableRow}>
            <Text style={styles.cell}>{range.unit_type}</Text>
            <Text style={styles.cell}>{formatPriceOrFallback(range.min)}</Text>
            <Text style={styles.cell}>{formatPriceOrFallback(range.average)}</Text>
            <Text style={styles.cell}>{formatPriceOrFallback(range.max)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TagList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.listGrid}>
        {items.map((item) => (
          <Text key={item} style={styles.tag}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

function NotesList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <View style={styles.splitColumn}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={styles.noteItem}>
          - {item}
        </Text>
      ))}
    </View>
  );
}

function BuildingReportDocument({ building }: { building: BuildingWithRelations }) {
  const score = typeof building.overall_score === 'number' ? `${building.overall_score}/100 score` : 'Score not available';

  return (
    <Document title={`${building.name} Building Report`} author="Dubai Property IQ">
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.cover}>
          <Text style={styles.eyebrow}>Dubai Property IQ building report</Text>
          <Text style={styles.title}>{building.name}</Text>
          <Text style={styles.subtitle}>{building.description || `Investment intelligence for ${building.name} in ${locationLabel(building)}.`}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaPill}>{locationLabel(building)}</Text>
            <Text style={styles.metaPill}>{score}</Text>
            <Text style={styles.metaPill}>{reportDate()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decision signals</Text>
          <MetricGrid building={building} />
        </View>

        <DetailGrid building={building} />
        <TransactionSummary building={building} />
        <RangeTable title="Sale price ranges" ranges={building.unit_price_ranges} />
        <RangeTable title="Rental ranges" ranges={building.rental_ranges} />
        <TagList title="Amenities" items={building.amenities} />

        {building.nearby_places.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby places</Text>
            {building.nearby_places.map((place) => (
              <Text key={`${place.name}-${place.distance}`} style={styles.noteItem}>
                {[place.name, place.type, place.distance].filter(Boolean).join(' - ')}
              </Text>
            ))}
          </View>
        )}

        {(building.pros.length > 0 || building.cons.length > 0) && (
          <View style={styles.section}>
            <View style={styles.split}>
              <NotesList title="Pros" items={building.pros} />
              <NotesList title="Cons" items={building.cons} />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disclaimer</Text>
          <Text style={styles.paragraph}>
            This report is for informational use only. Verify current pricing, availability, service charges, and transaction data before making an investment decision.
          </Text>
        </View>

        <View fixed style={styles.footer}>
          <Text>Dubai Property IQ</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export async function createBuildingReportPdf(building: BuildingWithRelations): Promise<ArrayBuffer> {
  const stream = await pdf(<BuildingReportDocument building={building} />).toBuffer();
  return readableStreamToArrayBuffer(stream);
}
