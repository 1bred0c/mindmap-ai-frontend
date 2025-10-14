'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Brain,
    MoreHorizontal,
    Plus,
    Users,
    ArrowLeft,
    Calendar,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// -----------------------------
// 🔹 Type definitions
// -----------------------------
type Workspace = {
    workspaceId: number;
    name: string;
    description: string;
    createdat: string;
};

type Mindmap = {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
};

// -----------------------------
// 🔹 Environment-based API endpoint
// -----------------------------
const API_ENDPOINT =
    process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';

export default function WorkspaceDetailClient({
    workspace,
    mindmaps,
}: {
    workspace: Workspace | null;
    mindmaps: Mindmap[];
}) {
    const [data, setData] = useState<Workspace | null>(workspace);

    useEffect(() => {
        setData(workspace);
    }, [workspace]);

    // -----------------------------
    // 🔹 Handle delete
    // -----------------------------
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this workspace?')) return;

        const userData = localStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        const userId = parsedUser?.userid ?? 1; // backend key là userid, ko phải userId

        try {
            const res = await fetch(
                `${API_ENDPOINT}/workspaces/${data?.workspaceId}?userId=${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                }
            );

            if (!res.ok) throw new Error('Failed to delete workspace');
            toast.success('Workspace deleted successfully!');
            window.location.href = '/workspaces';
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        }
    };

    // -----------------------------
    // 🔹 UI render
    // -----------------------------
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
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    Delete Workspace
                </Button>
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
                                    ? formatDistanceToNow(new Date(data.createdat), {
                                        addSuffix: true,
                                    })
                                    : 'unknown'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/workspaces/${data.workspaceId}/share`}>
                            <Users className="h-4 w-4 mr-2" />
                            Share
                        </Link>
                    </Button>
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
                        <Card
                            key={mindmap.id}
                            className="hover:shadow-md transition-shadow group"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                                        <Brain className="h-6 w-6 text-secondary-foreground" />
                                    </div>
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
                                            <DropdownMenuItem asChild>
                                                <Link href={`/mindmaps/${mindmap.id}/edit`}>
                                                    Edit Mind Map
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Delete Mind Map
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-lg">{mindmap.title}</CardTitle>
                                <CardDescription>
                                    Last modified{' '}
                                    {formatDistanceToNow(new Date(mindmap.updatedAt), {
                                        addSuffix: true,
                                    })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Created{' '}
                                            {formatDistanceToNow(new Date(mindmap.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                    </div>
                                    <Button className="w-full" asChild>
                                        <Link href={`/mindmaps/${mindmap.id}`}>Open Mind Map</Link>
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
