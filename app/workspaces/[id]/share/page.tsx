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
    userid: number;
    email: string;
    permission: 'OWNER' | 'EDIT' | 'VIEW_ONLY';
};

export default function ShareWorkspacePage() {
    const { id } = useParams();
    const [members, setMembers] = useState<Member[]>([]);
    const [email, setEmail] = useState('');
    const [permission, setPermission] =
        useState<Member['permission']>('VIEW_ONLY');

    // 🧠 Load danh sách thành viên (join users qua FK)
    useEffect(() => {
        const fetchMembers = async () => {
            // ✅ Xem lại tên relationship trong tab Relationships (vd: fk_workspace_members_user)
            const { data, error } = await supabase
                .from('workspace_members')
                .select(
                    `
          userid,
          permission,
          users!fk_workspace_members_user (
            email
          )
        `
                )
                .eq('workspace_id', id);

            if (error) {
                toast.error('Cannot load members');
                console.error(error);
                return;
            }

            const formatted: Member[] =
                data?.map((m: any) => ({
                    userid: m.userid,
                    email: m.users?.email || '(unknown)',
                    permission: m.permission,
                })) || [];

            setMembers(formatted);
        };

        fetchMembers();
    }, [id]);

    // ➕ Thêm thành viên mới bằng email
    const handleAdd = async () => {
        if (!email.trim()) return toast.error('Please enter an email');

        // 1️⃣ Tìm user theo email
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('userid')
            .eq('email', email)
            .single();

        if (userError || !user) {
            toast.error('User not found');
            return;
        }

        const userid = user.userid;

        // 2️⃣ Kiểm tra xem user đã nằm trong workspace chưa
        const { data: existing } = await supabase
            .from('workspace_members')
            .select('userid')
            .eq('workspace_id', id)
            .eq('userid', userid)
            .maybeSingle();

        if (existing) {
            toast.warning('This user is already a member');
            return;
        }

        // 3️⃣ Thêm record mới
        const { error } = await supabase.from('workspace_members').insert([
            {
                workspace_id: id,
                userid,
                permission, // ✅ cột mới
            },
        ]);

        if (error) {
            toast.error('Failed to add member');
            console.error(error);
            return;
        }

        toast.success('Member added!');
        setMembers([...members, { userid, email, permission }]);
        setEmail('');
    };

    // ✏️ Cập nhật quyền
    const handlePermissionChange = async (
        userid: number,
        newPermission: Member['permission']
    ) => {
        const { error } = await supabase
            .from('workspace_members')
            .update({ permission: newPermission })
            .eq('workspace_id', id)
            .eq('userid', userid);

        if (error) {
            toast.error('Failed to update permission');
            console.error(error);
            return;
        }

        toast.success('Permission updated');
        setMembers((prev) =>
            prev.map((m) =>
                m.userid === userid ? { ...m, permission: newPermission } : m
            )
        );
    };

    // ❌ Xóa thành viên
    const handleRemove = async (userid: number) => {
        if (!confirm('Remove this member?')) return;

        const { error } = await supabase
            .from('workspace_members')
            .delete()
            .eq('workspace_id', id)
            .eq('userid', userid);

        if (error) {
            toast.error('Failed to remove member');
            console.error(error);
            return;
        }

        toast.success('Member removed');
        setMembers((prev) => prev.filter((m) => m.userid !== userid));
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
                    {members.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No members found in this workspace.
                        </p>
                    )}

                    {members.map((member) => (
                        <div
                            key={member.userid}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div>
                                <div className="font-medium">{member.email}</div>
                                <div className="text-sm text-muted-foreground">
                                    {member.permission}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <select
                                    value={member.permission}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            member.userid,
                                            e.target.value as Member['permission']
                                        )
                                    }
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value="OWNER">OWNER</option>
                                    <option value="EDIT">EDIT</option>
                                    <option value="VIEW_ONLY">VIEW_ONLY</option>
                                </select>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemove(member.userid)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Form thêm mới */}
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
