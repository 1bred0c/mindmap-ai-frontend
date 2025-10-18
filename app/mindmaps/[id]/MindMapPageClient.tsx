'use client';

import { MindMapEditor } from '@/components/mindmap-editor';
import { useRouter } from 'next/navigation';

type MindMapPageClientProps = {
    mindmap: any;
    mindmapId: number; // ✅ thêm prop này
    viewOnly: boolean;
};

export default function MindMapPageClient({ mindmap,
    mindmapId,
    viewOnly, }: MindMapPageClientProps) {
    const router = useRouter();

    const handleSave = (data: any) => {
        console.log('Saving mindmap:', mindmapId, data); // ✅ luôn có ID
    };

    return (
        <div className="min-h-screen">
            {/* ✅ Sử dụng nút Back bên trong MindMapEditor */}
            <MindMapEditor
                mindMapId={mindmapId}
                title={mindmap.title}
                viewOnly={viewOnly}
                showBackButton={true}
                onBack={() => router.push('/mindmaps')}
            />
        </div>
    );
}
