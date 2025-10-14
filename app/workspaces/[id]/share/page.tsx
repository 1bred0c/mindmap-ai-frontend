'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type Member = {
    email: string;
    permission: 'OWNER' | 'EDIT' | 'VIEW_ONLY';
};

export default function ShareWorkspacePage() {
    const { id } = useParams();
    const [members, setMembers] = useState<Member[]>([]);
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<Member['permission']>('VIEW_ONLY');

    useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from('workspacemembers')
                .select('email, permission')
                .eq('workspaceid', id);
            if (error) {
                toast.error('Cannot load members');
                console.error(error);
            } else {
                setMembers(data || []);
            }
        };
        fetchMembers();
    }, [id]);

    const handleAdd = async () => {
        if (!email) return toast.error('Please enter email');
        const { error } = await supabase
            .from('workspacemembers')
            .insert([{ workspaceid: id, email, permission }]);
        if (error) {
            toast.error('Failed to add member');
        } else {
            toast.success('Member added!');
            setMembers([...members, { email, permission }]);
            setEmail('');
        }
    };

    const handlePermissionChange = async (email: string, permission: Member['permission']) => {
        const { error } = await supabase
            .from('workspacemembers')
            .update({ permission })
            .eq('workspaceid', id)
            .eq('email', email);
        if (error) toast.error('Failed to update permission');
        else {
            toast.success('Permission updated');
            setMembers(members.map(m => (m.email === email ? { ...m, permission } : m)));
        }
    };

    const handleRemove = async (email: string) => {
        if (!confirm(`Remove ${email}?`)) return;
        const { error } = await supabase
            .from('workspacemembers')
            .delete()
            .eq('workspaceid', id)
            .eq('email', email);
        if (error) toast.error('Failed to remove');
        else {
            toast.success('Member removed');
            setMembers(members.filter(m => m.email !== email));
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Button variant="ghost" size="sm" asChild>
                <Link href={`/workspaces/${id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workspace
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Workspace Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {members.map((member) => (
                        <div key={member.email} className="flex justify-between items-center border-b py-2">
                            <div>
                                <div className="font-medium">{member.email}</div>
                                <div className="text-sm text-muted-foreground">{member.permission}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={member.permission}
                                    onChange={(e) =>
                                        handlePermissionChange(member.email, e.target.value as Member['permission'])
                                    }
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value="OWNER">OWNER</option>
                                    <option value="EDIT">EDIT</option>
                                    <option value="VIEW_ONLY">VIEW_ONLY</option>
                                </select>
                                <Button variant="destructive" size="sm" onClick={() => handleRemove(member.email)}>
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Add Member Form */}
                    <div className="flex items-center space-x-2 mt-4">
                        <Input
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <select
                            value={permission}
                            onChange={(e) =>
                                setPermission(e.target.value as Member['permission'])
                            }
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="VIEW_ONLY">VIEW_ONLY</option>
                            <option value="EDIT">EDIT</option>
                            <option value="OWNER">OWNER</option>
                        </select>
                        <Button onClick={handleAdd}>Add</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
