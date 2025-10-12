'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function NewWorkspacePage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Gửi dữ liệu lên backend hoặc cập nhật mock data
        // Sau khi tạo xong, chuyển hướng về trang workspaces
        router.push('/workspaces');
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
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter workspace name"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <Textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe this workspace"
                    />
                </div>
                <Button type="submit" className="w-full">
                    Create Workspace
                </Button>
            </form>
        </div>
    );
}