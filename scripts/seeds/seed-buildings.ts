/**
 * Building Seeder
 * Seeds realistic building intelligence records using real foreign keys from the current Supabase data.
 *
 * Run: npx tsx scripts/seeds/seed-buildings.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import type { Database } from '@/types/db/supabase-generated';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

type BuildingInsert = Database['public']['Tables']['buildings']['Insert'];

const IDS = {
  dubai: '17014caa-48d2-4203-8e11-e8fe74db1459',
  abuDhabi: '4c52ed42-5b8d-4e49-bf85-77ba75074210',
  downtownDubai: '944afc65-21df-409d-bed9-0251d4701271',
  yasIsland: 'ca6851eb-bb16-44f0-8f4b-c41a495145b9',
  alZafra: '95e810be-41a7-4411-995c-7ca98a4c3ac8',
  emaar: 'c4d8d706-3458-43d4-b775-a74c09a11cb5',
  aldar: '2c97e359-0f8c-4abc-b8e0-26b07fd36a35',
  azizi: '12256bed-4397-4708-906a-7bf2633dbbcb',
};

const image = (slug: string, index: number, altTag: string) => ({
  url: `https://example.com/building-photos/${slug}/${index}.jpg`,
  alt_tag: altTag,
});

const BUILDINGS: BuildingInsert[] = [
  {
    city_id: IDS.dubai,
    area_id: IDS.downtownDubai,
    developer_id: IDS.emaar,
    name: 'Burj Khalifa',
    slug: 'burj-khalifa',
    description: 'Iconic Downtown Dubai tower with branded residences, premium amenities, and unmatched city connectivity.',
    address: 'Sheikh Mohammed bin Rashid Boulevard, Downtown Dubai',
    location: { lat: 25.197197, lng: 55.274376 },
    photos: [image('burj-khalifa', 1, 'Burj Khalifa exterior'), image('burj-khalifa', 2, 'Burj Khalifa lobby'), image('burj-khalifa', 3, 'Burj Khalifa skyline view')],
    building_type: 'Residential tower',
    ownership_type: 'Freehold',
    completion_year: 2010,
    total_floors: 163,
    total_units: 900,
    property_types: ['apartment', 'penthouse'],
    avg_price_per_sqft: 3200,
    area_avg_price_per_sqft: 2500,
    rental_yield: 4.2,
    service_charge_aed_per_sqft: 65,
    short_term_rental_potential: 'High',
    demand_level: 'Very high',
    liquidity_score: 92,
    capital_growth_score: 90,
    lifestyle_score: 96,
    overall_score: 94,
    amenities: ['Concierge', 'Gym', 'Swimming Pool', 'Valet Parking', 'Security'],
    nearby_places: [
      { name: 'Dubai Mall', type: 'Mall', distance: '5 minutes walk' },
      { name: 'Burj Khalifa/Dubai Mall Metro Station', type: 'Metro', distance: '8 minutes walk' },
    ],
    unit_price_ranges: [
      { unit_type: '1BR', min: 2400000, max: 4200000, average: 3300000 },
      { unit_type: '2BR', min: 5200000, max: 9000000, average: 7000000 },
      { unit_type: '3BR', min: 9500000, max: 18000000, average: 13000000 },
    ],
    rental_ranges: [
      { unit_type: '1BR', min: 150000, max: 240000, average: 190000 },
      { unit_type: '2BR', min: 300000, max: 480000, average: 390000 },
    ],
    transaction_summary: {
      recent_sales_count: 42,
      average_transaction_value: 6200000,
      price_trend: 'Rising',
      notes: 'Consistent demand from end-users, investors, and branded residence buyers.',
    },
    pros: ['Global landmark address', 'Strong liquidity', 'Premium tenant demand'],
    cons: ['High service charges', 'Premium entry price'],
  },
  {
    city_id: IDS.abuDhabi,
    area_id: IDS.yasIsland,
    developer_id: IDS.aldar,
    name: 'Ansam 1',
    slug: 'ansam-1',
    description: 'Golf-facing Yas Island residence with strong end-user appeal and access to major leisure destinations.',
    address: 'Ansam, Yas Island, Abu Dhabi',
    location: { lat: 24.470913, lng: 54.600258 },
    photos: [image('ansam-1', 1, 'Ansam 1 exterior'), image('ansam-1', 2, 'Ansam community pool'), image('ansam-1', 3, 'Yas Island view from Ansam')],
    building_type: 'Residential tower',
    ownership_type: 'Freehold',
    completion_year: 2017,
    total_floors: 9,
    total_units: 220,
    property_types: ['apartment'],
    avg_price_per_sqft: 1450,
    area_avg_price_per_sqft: 1350,
    rental_yield: 6.4,
    service_charge_aed_per_sqft: 18,
    short_term_rental_potential: 'Medium',
    demand_level: 'High',
    liquidity_score: 82,
    capital_growth_score: 80,
    lifestyle_score: 88,
    overall_score: 84,
    amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Landscaped Gardens'],
    nearby_places: [
      { name: 'Yas Links Abu Dhabi', type: 'Golf Course', distance: '4 minutes drive' },
      { name: 'Yas Mall', type: 'Mall', distance: '7 minutes drive' },
    ],
    unit_price_ranges: [
      { unit_type: '1BR', min: 950000, max: 1300000, average: 1120000 },
      { unit_type: '2BR', min: 1450000, max: 2100000, average: 1750000 },
      { unit_type: '3BR', min: 2300000, max: 3200000, average: 2750000 },
    ],
    rental_ranges: [
      { unit_type: '1BR', min: 70000, max: 95000, average: 82000 },
      { unit_type: '2BR', min: 105000, max: 145000, average: 125000 },
    ],
    transaction_summary: {
      recent_sales_count: 24,
      average_transaction_value: 1650000,
      price_trend: 'Stable to rising',
      notes: 'Strong lifestyle-led demand from residents seeking Yas Island amenities and Abu Dhabi connectivity.',
    },
    pros: ['Golf and leisure access', 'Strong rental yields', 'Established Aldar community'],
    cons: ['Car-dependent for daily commuting', 'Limited ultra-luxury positioning'],
  },
  {
    city_id: IDS.abuDhabi,
    area_id: IDS.alZafra,
    developer_id: IDS.azizi,
    name: 'Al Zafra Residence',
    slug: 'al-zafra-residence',
    description: 'Mid-market Abu Dhabi residential building with practical layouts and steady long-term rental demand.',
    address: 'Al Zafra, Abu Dhabi',
    location: { lat: 24.453884, lng: 54.377344 },
    photos: [image('al-zafra-residence', 1, 'Al Zafra Residence exterior'), image('al-zafra-residence', 2, 'Al Zafra Residence lobby'), image('al-zafra-residence', 3, 'Al Zafra neighborhood view')],
    building_type: 'Residential building',
    ownership_type: 'Freehold',
    completion_year: 2019,
    total_floors: 14,
    total_units: 180,
    property_types: ['apartment'],
    avg_price_per_sqft: 980,
    area_avg_price_per_sqft: 925,
    rental_yield: 6.8,
    service_charge_aed_per_sqft: 13,
    short_term_rental_potential: 'Low',
    demand_level: 'Medium',
    liquidity_score: 72,
    capital_growth_score: 68,
    lifestyle_score: 70,
    overall_score: 70,
    amenities: ['Gym', 'Parking', 'Security', 'Lobby', 'Maintenance'],
    nearby_places: [
      { name: 'Abu Dhabi Corniche', type: 'Waterfront', distance: '12 minutes drive' },
      { name: 'Al Wahda Mall', type: 'Mall', distance: '10 minutes drive' },
    ],
    unit_price_ranges: [
      { unit_type: '1BR', min: 650000, max: 850000, average: 740000 },
      { unit_type: '2BR', min: 920000, max: 1250000, average: 1080000 },
    ],
    rental_ranges: [
      { unit_type: '1BR', min: 48000, max: 62000, average: 55000 },
      { unit_type: '2BR', min: 70000, max: 90000, average: 80000 },
    ],
    transaction_summary: {
      recent_sales_count: 12,
      average_transaction_value: 920000,
      price_trend: 'Stable',
      notes: 'Rental-led demand with affordability and access to central Abu Dhabi as key drivers.',
    },
    pros: ['Affordable entry price', 'Healthy rental yield', 'Central Abu Dhabi access'],
    cons: ['Lower capital growth profile', 'Limited lifestyle amenities'],
  },
];

async function seedBuildings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Missing required environment variables:');
    if (!url) console.error('- NEXT_PUBLIC_SUPABASE_URL');
    if (!serviceKey) console.error('- SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Seeding ${BUILDINGS.length} buildings...`);

  const { data, error } = await supabase.from('buildings').upsert(BUILDINGS, { onConflict: 'area_id,slug' }).select('id, name, slug');

  if (error) {
    console.error('Failed to seed buildings:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} buildings:`);
  data?.forEach((building) => console.log(`- ${building.name} (${building.slug})`));
}

seedBuildings().catch((error) => {
  console.error(error);
  process.exit(1);
});
