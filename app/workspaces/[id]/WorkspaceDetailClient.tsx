'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Brain, MoreHorizontal, Plus, Users, ArrowLeft, Calendar,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

type Workspace = {
    workspaceId: number;
    name: string;
    description: string;
    createdat: string;
    ownerId: number;
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

const API_ENDPOINT =
    process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';


export default function WorkspaceDetailClient({ workspace }: { workspace: Workspace | null }) {
    const [data, setData] = useState<Workspace | null>(workspace);
    const [mindmaps, setMindmaps] = useState<Mindmap[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUserId(parsedUser?.userId ?? null);
                    setIsOwner(parsedUser?.userId === workspace?.ownerId);
                }
            } catch (err) {
                console.warn('⚠️ Invalid user data', err);
            }
        }
    }, [workspace]);
    useEffect(() => {
        setData(workspace);
    }, [workspace]);

    // 🔹 Lấy danh sách mindmaps theo workspaceId
    useEffect(() => {

        const fetchMindmaps = async () => {
            if (!workspace?.workspaceId) return;
            
            const token = localStorage.getItem('token');
            console.log('🔐 Token exists:', !!token);
            console.log('🔐 Token preview:', token ? token.substring(0, 20) + '...' : 'null');
            
            if (!token) {
                toast.error('Please login to view workspace');
                window.location.href = '/auth/login';
                return;
            }
            
            try {
                console.log('📡 Fetching mindmaps from:', `${API_ENDPOINT}/mindmap/workspace/${workspace.workspaceId}`);
                
                const res = await fetch(`${API_ENDPOINT}/mindmap/workspace/${workspace.workspaceId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('📡 Response status:', res.status);
                console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));

                if (res.status === 401) {
                    const errorText = await res.text();
                    console.error('❌ 401 Unauthorized:', errorText);
                    toast.error('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/auth/login';
                    return;
                }

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('❌ API Error:', errorText);
                    throw new Error('Failed to fetch mindmaps');
                }
                
                const data = await res.json();
                console.log('✅ Mindmaps loaded:', data.length);
                const filtered = isOwner ? data : data.filter((m: Mindmap) => m.public);
                setMindmaps(filtered);
            } catch (error) {
                console.error('❌ Fetch error:', error);
                toast.error('Cannot load mind maps');
            }
        };

        fetchMindmaps();
    }, [workspace?.workspaceId, isOwner]);


    // 🔹 Xoá mindmap
    const handleDeleteMindmap = async (mindMapId: number) => {
        if (!confirm('Are you sure you want to delete this mind map?')) return;

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to delete');
            window.location.href = '/auth/login';
            return;
        }

        try {
            const res = await fetch(`${API_ENDPOINT}/mindmap/${mindMapId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
                return;
            }

            if (!res.ok) throw new Error('Failed to delete mind map');

            toast.success('🗑️ Mind map deleted successfully!');
            setMindmaps((prev) => prev.filter((m) => m.mindMapId !== mindMapId));
        } catch (error) {
            console.error(error);
            toast.error('Error deleting mind map');
        }
    };



    const handleSetPublic = async (mindMapId: number, value: boolean) => {
        try {
            const { data, error } = await supabase
                .from('mindmaps')
                .update({ is_public: value })         // ⬅️ nếu cột bạn là is_public, đổi thành { is_public: value }
                .eq('mind_map_id', mindMapId)       // ⬅️ nếu khóa là mind_map_id thì đổi cho khớp
                .select('mind_map_id, is_public')      // trả về để đồng bộ UI
                .single();

            if (error) throw error;

            toast.success(`Mind map is now ${value ? 'Public' : 'Private'}`);

            setMindmaps(prev =>
                prev.map(m => (m.mindMapId === mindMapId ? { ...m, public: value } : m))
            );
        } catch (err) {
            console.error(err);
            toast.error('Error updating visibility');
        }
    };


    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this workspace?')) return;

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to delete workspace');
            window.location.href = '/auth/login';
            return;
        }

        try {
            const res = await fetch(`${API_ENDPOINT}/workspaces/${data?.workspaceId}?userId=${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
                return;
            }

            if (!res.ok) throw new Error('Failed to delete workspace');
            toast.success('Workspace deleted successfully!');
            window.location.href = '/workspaces';
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        }
    };

    if (!data) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">Workspace not found</h1>
                <Button asChild className="mt-4">
                    <Link href="/workspaces">Back to Workspaces</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Back + Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/workspaces">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Link>
                </Button>

                {isOwner && (
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        Delete Workspace
                    </Button>
                )}

            </div>

            {/* Workspace Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{data.name}</h1>
                        <p className="text-muted-foreground">{data.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary">{mindmaps.length} mind maps</Badge>
                            <span className="text-sm text-muted-foreground">
                                Created{' '}
                                {data.createdat
                                    ? formatDistanceToNow(new Date(data.createdat), { addSuffix: true })
                                    : 'unknown'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">

                    {isOwner && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/workspaces/${data.workspaceId}/share`}>
                                <Users className="h-4 w-4 mr-2" />
                                Share
                            </Link>
                        </Button>
                    )}
                    <Button asChild>
                        <Link href={`/mindmaps/new?workspace=${data.workspaceId}`}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Mind Map
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Mindmaps Grid */}
            {mindmaps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mindmaps.map((mindmap) => (
                        <Card key={mindmap.mindMapId} className="hover:shadow-md transition-shadow group">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                                        <Brain className="h-6 w-6 text-secondary-foreground" />
                                    </div>
                                    {isOwner && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                {mindmap.public ? (
                                                    <DropdownMenuItem onClick={() => handleSetPublic(mindmap.mindMapId, false)}>
                                                        Make Private
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handleSetPublic(mindmap.mindMapId, true)}>
                                                        Make Public
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuItem
                                                    className="text-destructive cursor-pointer"
                                                    onClick={() => handleDeleteMindmap(mindmap.mindMapId)}
                                                >
                                                    Delete Mind Map
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>


                                        </DropdownMenu>

                                    )}


                                </div>
                                <CardTitle className="text-lg">{mindmap.title}</CardTitle>
                                <CardDescription>
                                    Last modified{' '}
                                    {formatDistanceToNow(new Date(mindmap.updatedAt), { addSuffix: true })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Created{' '}
                                            {formatDistanceToNow(new Date(mindmap.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <Badge variant={mindmap.public ? 'default' : 'secondary'}>
                                        {mindmap.public ? 'Public' : 'Private'}
                                    </Badge>
                                    <Button className="w-full" asChild>
                                        <Link
                                            href={`/mindmaps/${mindmap.mindMapId}?userId=${userId}`}
                                        >
                                            Open Mind Map
                                        </Link>
                                    </Button>


                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <CardTitle className="mb-2">No mind maps yet</CardTitle>
                        <CardDescription className="mb-6">
                            Create your first mind map in this workspace to get started.
                        </CardDescription>
                        <Button asChild>
                            <Link href={`/mindmaps/new?workspace=${data.workspaceId}`}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Mind Map
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
