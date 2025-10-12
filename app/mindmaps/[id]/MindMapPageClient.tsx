'use client';

import { MindMapEditor } from '@/components/mindmap-editor';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MindMapPageClient({ mindmap }: { mindmap: any }) {
    const router = useRouter();

    const handleSave = (data: any) => {
        // In a real app, this would save to the backend
        console.log('Saving mindmap:', mindmap.id, data);
    };

    return (
        <div className="min-h-screen">
            <div className="absolute top-4 left-4 z-10">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>
            <MindMapEditor title={mindmap.title} onSave={handleSave} />
        </div>
    );
}