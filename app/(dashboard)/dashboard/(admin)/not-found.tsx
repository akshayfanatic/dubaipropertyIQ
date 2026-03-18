'use client';

import { AlertTriangle, Search, LayoutDashboard, Users, Settings, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, type FormEvent } from 'react';

const quickLinks = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/profile', label: 'Profile', icon: Users },
  { href: '#', label: 'Analytics', icon: BarChart3 },
  { href: '#', label: 'Settings', icon: Settings },
];

export default function AdminNotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement actual search functionality here
      router.push(`/dashboard/admin/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search admin pages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </form>

        {/* Quick Links */}
        <div className="mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-3">Quick Links</p>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Back Button */}
        <Link href="/dashboard/admin">
          <Button className="cursor-pointer">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
