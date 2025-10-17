'use client';

import { MindMapEditor } from '@/components/mindmap-editor';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
            {/* 🔙 Nút quay lại */}
            <div className="absolute top-4 left-4 z-10">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* ✅ Truyền ID xuống editor */}
            <MindMapEditor
                mindMapId={mindmapId}
                title={mindmap.title}
                viewOnly={viewOnly}

            />
        </div>
    );
}
