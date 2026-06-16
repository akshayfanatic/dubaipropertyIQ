/**
 * Blog Category Seeder
 * Seeds reusable blog categories for testing blog category CRUD and blog assignment.
 *
 * Run: npm run seed:blog-categories
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import type { Database } from '@/types/db/supabase-generated';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

type BlogCategoryInsert = Database['public']['Tables']['blog_categories']['Insert'];

const BLOG_CATEGORIES: BlogCategoryInsert[] = [
  {
    name: 'Market Guides',
    slug: 'market-guides',
    description: 'Dubai real estate market updates, pricing trends, and investor guidance.',
    is_active: true,
  },
  {
    name: 'Area Guides',
    slug: 'area-guides',
    description: 'Neighborhood and community guides for Dubai property buyers and renters.',
    is_active: true,
  },
  {
    name: 'Investment Tips',
    slug: 'investment-tips',
    description: 'Practical advice for rental yields, capital growth, and portfolio planning.',
    is_active: true,
  },
  {
    name: 'Buying Process',
    slug: 'buying-process',
    description: 'Step-by-step explainers for buying property in Dubai.',
    is_active: true,
  },
  {
    name: 'Off Plan Projects',
    slug: 'off-plan-projects',
    description: 'Guides and updates for off-plan developments, payment plans, and handovers.',
    is_active: true,
  },
  {
    name: 'Golden Visa',
    slug: 'golden-visa',
    description: 'Property-linked UAE Golden Visa guides and eligibility explainers.',
    is_active: true,
  },
  {
    name: 'Mortgage Guides',
    slug: 'mortgage-guides',
    description: 'Mortgage, financing, affordability, and buyer cost guidance.',
    is_active: true,
  },
  {
    name: 'Developer News',
    slug: 'developer-news',
    description: 'Developer announcements, launches, and project updates.',
    is_active: true,
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Dubai living, amenities, schools, transport, and lifestyle content.',
    is_active: true,
  },
  {
    name: 'Archived Test Category',
    slug: 'archived-test-category',
    description: 'Inactive category for testing filters and edit states.',
    is_active: false,
  },
];

async function seedBlogCategories() {
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

  console.log(`Seeding ${BLOG_CATEGORIES.length} blog categories...`);

  const { data, error } = await supabase.from('blog_categories').upsert(BLOG_CATEGORIES, { onConflict: 'slug' }).select('id, name, slug, is_active').order('name');

  if (error) {
    console.error('Failed to seed blog categories:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} blog categories:`);
  data?.forEach((category) => {
    const status = category.is_active ? 'active' : 'inactive';
    console.log(`- ${category.name} (${category.slug}, ${status})`);
  });
}

seedBlogCategories().catch((error) => {
  console.error(error);
  process.exit(1);
});
