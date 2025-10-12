import MindMapPageClient from './MindMapPageClient';
import { mockMindmaps } from '@/lib/mock-data';

export function generateStaticParams() {
  return mockMindmaps.map(mindmap => ({ id: mindmap.id }));
}

export default function MindMapPage({ params }: { params: { id: string } }) {
  const mindmap = mockMindmaps.find(m => m.id === params.id);

  if (!mindmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mind map not found</h1>
        </div>
      </div>
    );
  }

  return <MindMapPageClient mindmap={mindmap} />;
}