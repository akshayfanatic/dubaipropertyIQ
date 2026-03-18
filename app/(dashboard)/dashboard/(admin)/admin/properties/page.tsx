import { notFound } from 'next/navigation';
import { Building2, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Property {
  id: string;
  title: string;
  // Add more fields as needed
}

// Placeholder data - replace with actual Supabase query
async function getProperties(): Promise<Property[] | null> {
  // TODO: Replace with actual Supabase query
  // const supabase = await serverClient();
  // const { data, error } = await supabase.from('properties').select('*');
  // if (error) return null;
  // return data;

  return []; // Empty for now
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  // If properties data fetch fails, show not-found
  if (properties === null) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button className="cursor-pointer w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search properties..." className="pl-10" />
        </div>
        <Button variant="outline" className="cursor-pointer">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border/60 bg-card p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No properties yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first property listing.</p>
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Property cards will go here */}
          {properties.map((property) => (
            <div key={property.id} className="rounded-xl border border-border/60 bg-card p-6">
              {/* Property card content */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
