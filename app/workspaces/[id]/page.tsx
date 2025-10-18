import { DashboardLayout } from '@/components/layout/dashboard-layout';
import WorkspaceDetailClient from './WorkspaceDetailClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  return []; // bỏ static prebuild để tránh lỗi export
}
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';
export default async function WorkspaceDetailPage({ params }: { params: { id: string } }) {

  const res = await fetch(`${API_ENDPOINT}/workspaces/${params.id}`, {
    cache: 'no-store',
  });
  const workspace = await res.json();

  return (
    <DashboardLayout>
      <WorkspaceDetailClient workspace={workspace} />
    </DashboardLayout>
  );
}
