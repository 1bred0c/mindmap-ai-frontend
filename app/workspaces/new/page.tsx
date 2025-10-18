'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // nếu bạn đang dùng sonner để hiển thị thông báo

export default function NewWorkspacePage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🔹 Lấy thông tin user từ localStorage
            const userData = localStorage.getItem('user');
            const parsedUser = userData ? JSON.parse(userData) : null;
            const ownerId = parsedUser?.userId ?? 1;

            // 🔹 Gửi request đến backend
            const response = await fetch(
                `${API_ENDPOINT}/workspaces?ownerId=${ownerId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                    body: JSON.stringify({
                        name,
                        description,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create workspace: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Created workspace:', result);

            // 🔹 Hiển thị thông báo thành công
            if (toast) toast.success('Workspace created successfully!');
            else alert('Workspace created successfully!');

            // 🔹 Chuyển hướng về danh sách workspaces
            router.push('/workspaces');
        } catch (error: any) {
            console.error(error);
            if (toast) toast.error(error.message || 'Error creating workspace');
            else alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow p-8 w-full max-w-md space-y-6"
            >
                <h1 className="text-2xl font-bold mb-4">Create New Workspace</h1>

                <div>
                    <label className="block mb-1 font-medium">Workspace Name</label>
                    <Input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter workspace name"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe this workspace"
                    />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Workspace'}
                </Button>
            </form>
        </div>
    );
}
