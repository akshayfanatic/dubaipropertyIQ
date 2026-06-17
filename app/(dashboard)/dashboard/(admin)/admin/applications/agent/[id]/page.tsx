import { redirect } from 'next/navigation';

interface AdminAgentApplicationPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAgentApplicationPage({ params }: AdminAgentApplicationPageProps) {
  const { id } = await params;
  redirect(`/dashboard/admin/applications/${id}`);
}
