/**
 * Blog Tag Seeder
 * Seeds reusable blog tags for testing blog tag CRUD and future blog tag assignment.
 *
 * Run: npm run seed:blog-tags
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import type { Database } from '@/types/db/supabase-generated';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

type BlogTagInsert = Database['public']['Tables']['blog_tags']['Insert'];

const BLOG_TAGS: BlogTagInsert[] = [
  {
    name: 'ROI',
    slug: 'roi',
    description: 'Return on investment, rental yield, and capital growth content.',
  },
  {
    name: 'Freehold',
    slug: 'freehold',
    description: 'Freehold ownership areas, rules, and buyer guidance.',
  },
  {
    name: 'Luxury',
    slug: 'luxury',
    description: 'Premium homes, branded residences, and high-end Dubai communities.',
  },
  {
    name: 'First-Time Buyer',
    slug: 'first-time-buyer',
    description: 'Helpful explainers for users buying Dubai property for the first time.',
  },
  {
    name: 'Payment Plan',
    slug: 'payment-plan',
    description: 'Developer payment plans, post-handover plans, and installment structures.',
  },
  {
    name: 'Rental Yield',
    slug: 'rental-yield',
    description: 'Rental income, yield benchmarks, and landlord-focused content.',
  },
  {
    name: 'Capital Growth',
    slug: 'capital-growth',
    description: 'Price appreciation, growth corridors, and long-term investment trends.',
  },
  {
    name: 'Ready Property',
    slug: 'ready-property',
    description: 'Completed property, resale, and immediate occupancy topics.',
  },
  {
    name: 'Off Plan',
    slug: 'off-plan',
    description: 'Launches, construction timelines, handovers, and off-plan buyer guidance.',
  },
  {
    name: 'Mortgage',
    slug: 'mortgage',
    description: 'Financing, mortgage eligibility, rates, and affordability guidance.',
  },
  {
    name: 'Golden Visa',
    slug: 'golden-visa',
    description: 'UAE Golden Visa content linked to property ownership and eligibility.',
  },
  {
    name: 'Market Update',
    slug: 'market-update',
    description: 'Market reports, price trends, transaction activity, and demand signals.',
  },
];

async function seedBlogTags() {
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

  console.log(`Seeding ${BLOG_TAGS.length} blog tags...`);

  const { data, error } = await supabase.from('blog_tags').upsert(BLOG_TAGS, { onConflict: 'slug' }).select('id, name, slug').order('name');

  if (error) {
    console.error('Failed to seed blog tags:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} blog tags:`);
  data?.forEach((tag) => console.log(`- ${tag.name} (${tag.slug})`));
}

seedBlogTags().catch((error) => {
  console.error(error);
  process.exit(1);
});
