/**
 * Property Seeder
 * Seeds the database with realistic Dubai property listings
 *
 * Usage: npx tsx scripts/seeds/seed-properties.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'land';
type PropertyStatus = 'available' | 'sold' | 'reserved' | 'off_plan';

interface PropertyInsert {
  title: string;
  description: string;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  price_aed: number;
  status: PropertyStatus;
  golden_visa_eligible: boolean;
  photos: string[];
  features: string[];
  floor_plan: string | null;
}

// Dubai areas for realistic property names
const DUBAI_AREAS = [
  'Dubai Marina',
  'Palm Jumeirah',
  'Downtown Dubai',
  'JBR',
  'Dubai Hills Estate',
  'Arabian Ranches',
  'Emirates Hills',
  'Jumeirah Bay Island',
  'Bluewaters Island',
  'Damac Hills',
  'Meydan',
  'Business Bay',
  'Dubai Creek Harbour',
  'Al Barari',
  'Jumeirah Golf Estate',
];

const PROPERTY_FEATURES = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Balcony',
  'Sea View',
  'Garden',
  "Maid's Room",
  'Smart Home',
  'Built-in Wardrobes',
  'Walk-in Closet',
  'Fully Fitted Kitchen',
  'Central A/C',
  'Pet Friendly',
  'BBQ Area',
  "Children's Play Area",
  'Concierge',
  'Security',
  'Jacuzzi',
  'Sauna',
  'Private Beach Access',
];

const APARTMENT_DESCRIPTIONS = [
  'Luxurious apartment with stunning views and premium finishes throughout.',
  'Modern living at its finest with state-of-the-art amenities.',
  'Spacious apartment featuring floor-to-ceiling windows and elegant design.',
  'Contemporary living space in a prime location with world-class facilities.',
];

const VILLA_DESCRIPTIONS = [
  'Magnificent villa offering unparalleled luxury and privacy.',
  'Stunning family home with expansive outdoor living spaces.',
  'Exquisite villa featuring premium finishes and resort-style amenities.',
  'Exceptional property with landscaped gardens and private pool.',
];

const PENTHOUSE_DESCRIPTIONS = [
  'Ultra-luxury penthouse with panoramic views and bespoke interiors.',
  'Exclusive penthouse offering the pinnacle of Dubai living.',
  'Sophisticated penthouse with private terrace and infinity pool.',
];

const TOWNHOUSE_DESCRIPTIONS = [
  'Modern townhouse perfect for family living with community amenities.',
  'Stylish townhouse featuring contemporary design and private garden.',
  'Spacious townhouse in a gated community with shared facilities.',
];

const LAND_DESCRIPTIONS = [
  'Prime plot of land in a sought-after location with development potential.',
  'Investment opportunity in a rapidly growing area of Dubai.',
  'Land parcel with approved plans for luxury residential development.',
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePropertyTitle(type: PropertyType, area: string): string {
  const typeLabels: Record<PropertyType, string[]> = {
    apartment: ['Apartment', 'Flat', 'Studio', 'Duplex'],
    villa: ['Villa', 'Villa Compound', 'Mansion'],
    townhouse: ['Townhouse', 'Row House'],
    penthouse: ['Penthouse', 'Sky Villa'],
    land: ['Plot', 'Land', 'Development Site'],
  };

  const bedrooms = type === 'land' ? '' : `${Math.floor(Math.random() * 5) + 1}-BR `;
  const label = getRandomElement(typeLabels[type]);

  return `${bedrooms}${label} in ${area}`;
}

function generateDescription(type: PropertyType): string {
  const descriptions: Record<PropertyType, string[]> = {
    apartment: APARTMENT_DESCRIPTIONS,
    villa: VILLA_DESCRIPTIONS,
    townhouse: TOWNHOUSE_DESCRIPTIONS,
    penthouse: PENTHOUSE_DESCRIPTIONS,
    land: LAND_DESCRIPTIONS,
  };

  return getRandomElement(descriptions[type]);
}

function generatePrice(type: PropertyType): number {
  const priceRanges: Record<PropertyType, [number, number]> = {
    apartment: [800_000, 5_000_000],
    villa: [3_000_000, 50_000_000],
    townhouse: [1_500_000, 8_000_000],
    penthouse: [8_000_000, 100_000_000],
    land: [2_000_000, 30_000_000],
  };

  const [min, max] = priceRanges[type];
  return Math.round((Math.random() * (max - min) + min) / 100_000) * 100_000;
}

function generateSize(type: PropertyType): number {
  const sizeRanges: Record<PropertyType, [number, number]> = {
    apartment: [500, 2500],
    villa: [4000, 15000],
    townhouse: [2000, 5000],
    penthouse: [3000, 12000],
    land: [5000, 50000],
  };

  const [min, max] = sizeRanges[type];
  return Math.round((Math.random() * (max - min) + min) / 100) * 100;
}

function generateBedrooms(type: PropertyType): number {
  if (type === 'land') return 0;

  const ranges: Record<Exclude<PropertyType, 'land'>, [number, number]> = {
    apartment: [0, 4],
    villa: [4, 8],
    townhouse: [2, 5],
    penthouse: [3, 6],
  };

  const [min, max] = ranges[type as Exclude<PropertyType, 'land'>];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBathrooms(bedrooms: number): number {
  return Math.max(1, bedrooms + Math.floor(Math.random() * 2));
}

function generateProperty(): PropertyInsert {
  const type = getRandomElement<PropertyType>(['apartment', 'apartment', 'apartment', 'villa', 'villa', 'townhouse', 'penthouse', 'land']);
  const area = getRandomElement(DUBAI_AREAS);
  const price = generatePrice(type);
  const bedrooms = generateBedrooms(type);
  const isGoldenVisa = price >= 2_000_000;

  const statuses: PropertyStatus[] = ['available', 'available', 'available', 'reserved', 'sold', 'off_plan'];
  const status = getRandomElement(statuses);

  return {
    title: generatePropertyTitle(type, area),
    description: generateDescription(type),
    property_type: type,
    bedrooms,
    bathrooms: generateBathrooms(bedrooms),
    size_sqft: generateSize(type),
    price_aed: price,
    status,
    golden_visa_eligible: isGoldenVisa,
    photos: [],
    features: type === 'land' ? [] : getRandomElements(PROPERTY_FEATURES, 3, 8),
    floor_plan: type === 'land' ? null : `https://example.com/floorplans/${Date.now()}.pdf`,
  };
}

async function seedProperties(count: number = 50) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('❌ Missing required environment variables:');
    if (!url) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    if (!serviceKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`🌱 Seeding ${count} properties...\n`);

  const properties: PropertyInsert[] = [];
  for (let i = 0; i < count; i++) {
    properties.push(generateProperty());
  }

  // Insert in batches of 10
  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < properties.length; i += batchSize) {
    const batch = properties.slice(i, i + batchSize);

    const { data, error } = await supabase.from('properties').insert(batch).select();

    if (error) {
      console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      continue;
    }

    inserted += data?.length || 0;
    console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(count / batchSize)} (${data?.length || 0} properties)`);
  }

  console.log(`\n🎉 Seeding complete! ${inserted}/${count} properties inserted.`);

  // Show summary stats
  const { data: stats } = await supabase.from('properties').select('status, property_type, golden_visa_eligible');

  if (stats && stats.length > 0) {
    const summary = {
      total: stats.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      goldenVisa: 0,
    };

    stats.forEach((item) => {
      summary.byType[item.property_type] = (summary.byType[item.property_type] || 0) + 1;
      summary.byStatus[item.status] = (summary.byStatus[item.status] || 0) + 1;
      if (item.golden_visa_eligible) summary.goldenVisa++;
    });

    console.log('\n📊 Database Summary:');
    console.log(`   Total Properties: ${summary.total}`);
    console.log(`   Golden Visa Eligible: ${summary.goldenVisa}`);
    console.log('\n   By Type:');
    Object.entries(summary.byType).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });
    console.log('\n   By Status:');
    Object.entries(summary.byStatus).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });
  }
}

// Run seeder
const count = parseInt(process.argv[2]) || 50;
seedProperties(count).catch(console.error);
