'use client';

import { MindMapEditor } from '@/components/mindmap-editor';

export default function NewMindMapPage() {
    return (
        <div className="min-h-screen">
            {/* <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Create New Mind Map</h1>
            </div> */}
            <MindMapEditor nodes={[]} edges={[]} />
        </div>
    );
}