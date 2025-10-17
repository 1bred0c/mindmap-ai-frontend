'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MindMapEditor } from '@/components/mindmap-editor';

const API_ENDPOINT =
    process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';

type Workspace = {
    workspaceId: number;
    name: string;
    description: string;
};

type Mindmap = {
    mindMapId: number;
    title: string;
    description: string;
    workspaceId: number;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
    public: boolean;
};

export default function NewMindMapPage() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [createdMindmap, setCreatedMindmap] = useState<Mindmap | null>(null);

    // 🔹 Lấy workspace theo userId
    useEffect(() => {
        const fetchWorkspaces = async () => {
            const userData = localStorage.getItem('user');
            const parsedUser = userData ? JSON.parse(userData) : null;
            const ownerId = parsedUser?.userId ?? 1; // ✅ dùng key userId

            try {
                const res = await fetch(`${API_ENDPOINT}/workspaces/owner/${ownerId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch workspaces');
                const data = await res.json();
                setWorkspaces(data);
                if (data.length > 0) setSelectedWorkspace(String(data[0].workspaceId));
            } catch (error) {
                console.error(error);
                toast.error('Cannot load workspaces');
            }
        };
        fetchWorkspaces();
    }, []);

    // 🔹 Tạo mindmap (và hiển thị MindMapEditor)
    const handleCreate = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title.');
            return;
        }
        if (!selectedWorkspace) {
            toast.error('Please select a workspace.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You must log in first.');
            return;
        }

        setLoading(true);
        try {
            const userData = localStorage.getItem('user');
            const parsedUser = userData ? JSON.parse(userData) : null;
            const ownerId = parsedUser?.userId ?? 1;
            const res = await fetch(`${API_ENDPOINT}/mindmap?ownerId=${ownerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    workspaceId: Number(selectedWorkspace),
                    public: isPublic,
                }),
            });

            if (!res.ok) throw new Error('Failed to create mind map');
            const newMindmap = await res.json();

            toast.success('Mind map created successfully!');
            setCreatedMindmap(newMindmap); // ✅ gán vào state để mở editor
        } catch (error) {
            console.error(error);
            toast.error('Error creating mind map');
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Nếu đã tạo → hiển thị editor luôn
    if (createdMindmap) {
        return (
            <div className="min-h-screen">
                <MindMapEditor
                    mindMapId={createdMindmap.mindMapId}
                    title={createdMindmap.title}
                    description={createdMindmap.description}
                    workspaceId={createdMindmap.workspaceId}
                    nodes={[]} // nếu bạn có node mặc định thì truyền vào đây
                    edges={[]}
                />
            </div>
        );
    }

    // 🔹 Form tạo mới
    return (
        <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Create New Mind Map</h1>

            <div className="space-y-4">
                {/* Workspace selection */}
                <div>
                    <Label>Workspace</Label>
                    <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a workspace" />
                        </SelectTrigger>
                        <SelectContent>
                            {workspaces.map((ws) => (
                                <SelectItem key={ws.workspaceId} value={String(ws.workspaceId)}>
                                    {ws.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Title */}
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        placeholder="Enter mind map title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="desc">Description</Label>
                    <Textarea
                        id="desc"
                        placeholder="Optional description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Public toggle */}
                <div className="flex items-center space-x-3">
                    <input
                        id="public"
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-4 w-4"
                    />
                    <Label htmlFor="public">Public Mind Map</Label>
                </div>

                <Button disabled={loading} onClick={handleCreate} className="w-full">
                    {loading ? 'Creating...' : 'Create Mind Map'}
                </Button>
            </div>
        </div>
    );
}
