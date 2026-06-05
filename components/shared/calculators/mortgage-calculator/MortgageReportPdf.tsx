'use client';

import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MortgageReportRow {
  year: number;
  principal: string;
  interest: string;
  balance: string;
}

export interface MortgageReportData {
  propertyValue: string;
  downPayment: string;
  downPaymentPercent: string;
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  monthlyPayment: string;
  totalInterest: string;
  totalPayment: string;
  rows: MortgageReportRow[];
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

function MortgageReportDocument({ data }: { data: MortgageReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Dubai Property IQ</Text>
          <Text style={styles.title}>Mortgage Report</Text>
          <Text style={styles.subtitle}>A snapshot of your mortgage payment, total interest, and yearly amortization schedule.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mortgage Summary</Text>
          <View style={styles.grid}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Property value</Text>
              <Text style={styles.metricValue}>{data.propertyValue}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Down payment</Text>
              <Text style={styles.metricValue}>
                {data.downPayment} ({data.downPaymentPercent})
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Loan amount</Text>
              <Text style={styles.metricValue}>{data.loanAmount}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Monthly payment</Text>
              <Text style={styles.metricValue}>{data.monthlyPayment}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Interest rate</Text>
              <Text style={styles.metricValue}>{data.interestRate}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Loan term</Text>
              <Text style={styles.metricValue}>{data.loanTerm}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Total interest</Text>
              <Text style={styles.metricValue}>{data.totalInterest}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Total payment</Text>
              <Text style={styles.metricValue}>{data.totalPayment}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yearly Amortization</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.headerCell]}>Year</Text>
              <Text style={[styles.cell, styles.headerCell]}>Principal</Text>
              <Text style={[styles.cell, styles.headerCell]}>Interest</Text>
              <Text style={[styles.cell, styles.headerCell]}>Balance</Text>
            </View>
            {data.rows.map((row) => (
              <View key={row.year} style={styles.tableRow}>
                <Text style={styles.cell}>{row.year}</Text>
                <Text style={styles.cell}>{row.principal}</Text>
                <Text style={styles.cell}>{row.interest}</Text>
                <Text style={styles.cell}>{row.balance}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.note}>This report is indicative only. Final bank offers can vary based on eligibility, fees, product type, income profile, and bank policy.</Text>
        </View>
      </Page>
    </Document>
  );
}

export function MortgageReportPdfDownload({ data }: { data: MortgageReportData }) {
  return (
    <PDFDownloadLink document={<MortgageReportDocument data={data} />} fileName="mortgage-report.pdf">
      {({ loading }) => (
        <Button type="button" variant="outline" className="mt-1 h-9 w-fit gap-2 rounded-lg">
          <Download className="size-4" />
          {loading ? 'Preparing PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
