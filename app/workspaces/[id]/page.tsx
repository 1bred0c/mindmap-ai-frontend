import { DashboardLayout } from '@/components/layout/dashboard-layout';
import WorkspaceDetailClient from './WorkspaceDetailClient';

export async function generateStaticParams() {
  return []; // bỏ static prebuild để tránh lỗi export
}

export default async function WorkspaceDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:8080/api/v1/workspaces/${params.id}`, {
    cache: 'no-store',
  });
  const workspace = await res.json();

  return (
    <DashboardLayout>
      <WorkspaceDetailClient workspace={workspace} />
    </DashboardLayout>
  );
}
