import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { mockWorkspaces, mockMindmaps } from '@/lib/mock-data';
import WorkspaceDetailClient from './WorkspaceDetailClient';

export function generateStaticParams() {
  return mockWorkspaces.map(workspace => ({ id: workspace.id }));
}

export default function WorkspaceDetailPage({ params }: { params: { id: string } }) {
  const workspaceId = params.id;
  const workspace = mockWorkspaces.find(w => w.id === workspaceId);
  const workspaceMindmaps = mockMindmaps.filter(m => m.workspaceId === workspaceId);

  return (
    <DashboardLayout>
      <WorkspaceDetailClient workspace={workspace} mindmaps={workspaceMindmaps} />
    </DashboardLayout>
  );
}