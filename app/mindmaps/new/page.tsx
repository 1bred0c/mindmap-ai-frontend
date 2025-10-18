'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MindMapEditor } from '@/components/mindmap-editor';
import { supabase } from '@/lib/supabaseClient';

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

// Types from AI
type NodeShape = 'RECTANGLE' | 'ELLIPSE' | 'DIAMOND' | 'ROUNDED_RECTANGLE';

interface AIGeneratedNode {
    content: string;
    parentNodeId: number | null;
    positionX: number;
    positionY: number;
    color: string;
    shape: NodeShape;
}

interface AIGeneratedEdge {
    fromNodeId: number;
    toNodeId: number;
    label: string;
}

interface AIGeneratedData {
    title: string;
    nodes: AIGeneratedNode[];
    edges: AIGeneratedEdge[];
    prompt?: string;
}

export default function NewMindMapPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isFromAI = searchParams.get('from') === 'ai';
    
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [createdMindmap, setCreatedMindmap] = useState<Mindmap | null>(null);
    const [aiData, setAiData] = useState<AIGeneratedData | null>(null);
    const [isCreatingNodes, setIsCreatingNodes] = useState(false);

    // 🔹 Load AI data nếu từ AI page
    useEffect(() => {
        if (isFromAI) {
            const storedData = sessionStorage.getItem('aiGeneratedMindmap');
            if (storedData) {
                try {
                    const parsed: AIGeneratedData = JSON.parse(storedData);
                    setAiData(parsed);
                    setTitle(parsed.title);
                    setDescription(parsed.prompt ? `AI generated from: ${parsed.prompt.substring(0, 100)}...` : 'AI generated mindmap');
                    console.log('📊 Loaded AI data:', parsed);
                } catch (err) {
                    console.error('Error parsing AI data:', err);
                    toast.error('Không thể tải dữ liệu AI');
                }
            } else {
                toast.error('Không tìm thấy dữ liệu AI');
            }
        }
    }, [isFromAI]);

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
            
            // 1. Tạo mindmap
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
            const mindMapId = newMindmap.mindMapId;

            toast.success('Mind map created successfully!');

            // 2. Nếu có dữ liệu từ AI, tạo nodes và edges
            if (aiData && aiData.nodes && aiData.nodes.length > 0) {
                setIsCreatingNodes(true);
                toast.info('Đang tạo nodes và edges từ AI...');

                try {
                    console.log('📝 Creating nodes for mindMapId:', mindMapId);
                    console.log('📝 Nodes to create:', aiData.nodes);

                    // 3. Tạo nodes qua Supabase và map ID
                    const nodeIdMap = new Map<number, number>(); // tempIndex -> realNodeId

                    for (let i = 0; i < aiData.nodes.length; i++) {
                        const node = aiData.nodes[i];

                        console.log(`Creating node ${i}:`, {
                            content: node.content,
                            position: { x: node.positionX, y: node.positionY },
                            color: node.color,
                            shape: node.shape
                        });

                        const { data, error } = await supabase
                            .from('nodes')
                            .insert({
                                mind_map_id: mindMapId,
                                content: node.content,
                                position_x: node.positionX,
                                position_y: node.positionY,
                                color: node.color,
                                shape: node.shape,
                            })
                            .select()
                            .single();

                        if (error) {
                            console.error(`❌ Failed to create node ${i}:`, {
                                error,
                                errorMessage: error.message,
                                errorDetails: error.details,
                                errorHint: error.hint,
                                code: error.code,
                                nodeData: node
                            });
                            continue; // Skip failed nodes
                        }

                        if (data) {
                            console.log(`✅ Node ${i} created with ID:`, data.node_id);
                            nodeIdMap.set(i, data.node_id);
                        }
                    }

                    console.log('🔗 Creating edges...');
                    console.log('🔗 Edges to create:', aiData.edges);
                    console.log('🗺️ Node ID mapping:', Array.from(nodeIdMap.entries()));

                    // 4. Tạo edges với ID thực qua Supabase
                    let successEdges = 0;

                    for (const edge of aiData.edges) {
                        const realFromId = nodeIdMap.get(edge.fromNodeId);
                        const realToId = nodeIdMap.get(edge.toNodeId);

                        console.log(`Edge: ${edge.fromNodeId} -> ${edge.toNodeId}`, {
                            fromIndex: edge.fromNodeId,
                            toIndex: edge.toNodeId,
                            realFromId,
                            realToId,
                            label: edge.label
                        });

                        if (!realFromId || !realToId) {
                            console.warn('⚠️ Skip edge due to missing node mapping:', edge);
                            continue;
                        }

                        const { data, error } = await supabase
                            .from('edges')
                            .insert({
                                mind_map_id: mindMapId,
                                from_node_id: realFromId,
                                to_node_id: realToId,
                                label: edge.label || '',
                            })
                            .select();

                        if (error) {
                            console.error('❌ Failed to create edge:', {
                                error,
                                errorMessage: error.message,
                                errorDetails: error.details,
                                errorHint: error.hint,
                                code: error.code,
                                edgeData: { fromNodeId: realFromId, toNodeId: realToId, label: edge.label }
                            });
                        } else {
                            console.log('✅ Edge created:', data);
                            successEdges++;
                        }
                    }

                    toast.success(`Đã tạo ${nodeIdMap.size} nodes và ${successEdges} edges!`);
                    
                    // Clear AI data từ sessionStorage
                    sessionStorage.removeItem('aiGeneratedMindmap');
                } catch (err) {
                    console.error('Error creating AI nodes/edges:', err);
                    toast.error('Có lỗi khi tạo nodes/edges từ AI');
                } finally {
                    setIsCreatingNodes(false);
                }
            }

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
                />
            </div>
        );
    }

    // 🔹 Form tạo mới
    return (
        <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">
                {isFromAI ? 'Create Mind Map from AI' : 'Create New Mind Map'}
            </h1>

            {isFromAI && aiData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        ✨ Bạn đang tạo mindmap từ AI với <strong>{aiData.nodes.length} nodes</strong> và{' '}
                        <strong>{aiData.edges.length} edges</strong>
                    </p>
                </div>
            )}

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

                <Button disabled={loading || isCreatingNodes} onClick={handleCreate} className="w-full">
                    {loading ? 'Creating...' : isCreatingNodes ? 'Creating nodes & edges...' : 'Create Mind Map'}
                </Button>
            </div>
        </div>
    );
}
