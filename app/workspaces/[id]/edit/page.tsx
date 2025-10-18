'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function EditWorkspacePage() {
    const { id } = useParams();
    const router = useRouter();
    const [workspace, setWorkspace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const res = await fetch(`${API_ENDPOINT}/workspaces/${id}`);
                if (!res.ok) throw new Error('Failed to load workspace');
                const data = await res.json();
                setWorkspace(data);
            } catch (err) {
                console.error(err);
                toast.error('Cannot load workspace info');
            } finally {
                setLoading(false);
            }
        };
        fetchWorkspace();
    }, [id]);

    const handleSave = async () => {
        if (!workspace) return;
        setSaving(true);
        try {
            const userData = localStorage.getItem('user');
            const parsedUser = userData ? JSON.parse(userData) : null;
            const userId = parsedUser?.userid ?? 1;

            const res = await fetch(`${API_ENDPOINT}/workspaces/${id}?userId=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({
                    name: workspace.name,
                    description: workspace.description,
                }),
            });
            if (!res.ok) throw new Error('Failed to update workspace');
            toast.success('Workspace updated successfully!');
            router.push(`/workspaces/${id}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <Button variant="ghost" size="sm" asChild>
                <Link href={`/workspaces/${id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workspace
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Workspace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <Input
                            value={workspace?.name || ''}
                            onChange={(e) =>
                                setWorkspace({ ...workspace, name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Description</label>
                        <Textarea
                            value={workspace?.description || ''}
                            onChange={(e) =>
                                setWorkspace({ ...workspace, description: e.target.value })
                            }
                        />
                    </div>

                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
