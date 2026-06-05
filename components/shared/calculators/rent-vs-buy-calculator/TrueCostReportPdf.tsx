'use client';

import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TrueCostReportRow {
  years: number;
  netRentalIncome: string;
  estimatedPropertyValue: string;
  roiPercent: string;
}

export interface TrueCostReportData {
  purchasePrice: string;
  annualRent: string;
  annualRentalIncome: string;
  serviceCharge: string;
  insurance: string;
  maintenanceReserve: string;
  tenYearRoi: string;
  tenYearGrossRentalIncome: string;
  rows: TrueCostReportRow[];
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#f7f8fb',
    color: '#20283a',
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#d9deea',
  },
  eyebrow: {
    marginBottom: 6,
    color: '#315fdc',
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.15,
  },
  subtitle: {
    marginTop: 8,
    color: '#657089',
    fontSize: 10,
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 700,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metric: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9deea',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  metricLabel: {
    marginBottom: 4,
    color: '#657089',
    fontSize: 8,
  },
  metricValue: {
    color: '#20283a',
    fontSize: 12,
    fontWeight: 700,
  },
  table: {
    borderWidth: 1,
    borderColor: '#d9deea',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e7eaf1',
  },
  tableHeader: {
    backgroundColor: '#eef2fb',
  },
  cell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
  },
  headerCell: {
    fontWeight: 700,
  },
  note: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eef2fb',
    color: '#657089',
    fontSize: 9,
    lineHeight: 1.5,
  },
});

function TrueCostReportDocument({ data }: { data: TrueCostReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Dubai Property IQ</Text>
          <Text style={styles.title}>True Cost ROI Report</Text>
          <Text style={styles.subtitle}>A snapshot of your rent-versus-buy and investment assumptions.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assumptions</Text>
          <View style={styles.grid}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Purchase price</Text>
              <Text style={styles.metricValue}>{data.purchasePrice}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Annual rent</Text>
              <Text style={styles.metricValue}>{data.annualRent}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Annual rental income</Text>
              <Text style={styles.metricValue}>{data.annualRentalIncome}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>10-year ROI</Text>
              <Text style={styles.metricValue}>{data.tenYearRoi}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Service charge</Text>
              <Text style={styles.metricValue}>{data.serviceCharge}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Insurance</Text>
              <Text style={styles.metricValue}>{data.insurance}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Maintenance reserve</Text>
              <Text style={styles.metricValue}>{data.maintenanceReserve}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>10-year gross rental income</Text>
              <Text style={styles.metricValue}>{data.tenYearGrossRentalIncome}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ROI Projections</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.headerCell]}>Years</Text>
              <Text style={[styles.cell, styles.headerCell]}>Net income</Text>
              <Text style={[styles.cell, styles.headerCell]}>Estimated value</Text>
              <Text style={[styles.cell, styles.headerCell]}>ROI</Text>
            </View>
            {data.rows.map((row) => (
              <View key={row.years} style={styles.tableRow}>
                <Text style={styles.cell}>{row.years}y</Text>
                <Text style={styles.cell}>{row.netRentalIncome}</Text>
                <Text style={styles.cell}>{row.estimatedPropertyValue}</Text>
                <Text style={styles.cell}>{row.roiPercent}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.note}>Net rental income deducts vacancy, management, service charges, insurance, and maintenance reserve. ROI uses upfront purchase costs as the capital base.</Text>
        </View>
      </Page>
    </Document>
  );
}

export function TrueCostReportPdfDownload({ data }: { data: TrueCostReportData }) {
  return (
    <PDFDownloadLink document={<TrueCostReportDocument data={data} />} fileName="true-cost-roi-report.pdf">
      {({ loading }) => (
        <Button type="button" variant="outline" className="mt-1 h-9 w-fit gap-2 rounded-lg">
          <Download className="size-4" />
          {loading ? 'Preparing PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
