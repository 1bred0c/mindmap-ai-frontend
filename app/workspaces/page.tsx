'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Folder,
  MoveHorizontal as MoreHorizontal,
  Calendar,
  Brain,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// -----------------------------
// 🔹 Type definition
// -----------------------------
type Workspace = {
  workspaceId: number;
  name: string;
  description: string;
  createdAt: string | null;
};

// -----------------------------
// 🔹 Helper function: safe date formatting
// -----------------------------
function formatSafeDate(dateStr: string | null): string {
  if (!dateStr) return 'unknown';
  try {
    // replace " " with "T" for JS Date compatibility
    const normalized = dateStr.replace(' ', 'T');
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return 'unknown';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'unknown';
  }
}

// -----------------------------
// 🔹 Main Component
// -----------------------------
export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all workspaces
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        const userId = parsedUser?.userId; // chú ý: BE của bạn đang dùng "ownerId" = userid
        if (!userId) throw new Error('User ID not found in localStorage');

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1'}/workspaces/owner/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch user workspaces');
        const data = await res.json();
        console.log('✅ Workspaces loaded for user:', userId, data);
        setWorkspaces(data);
      } catch (error) {
        console.error(error);
        toast.error('Cannot load your workspaces');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // 🔹 Handle delete workspace
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this workspace?')) return;

    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    const userId = parsedUser?.userid ?? 1;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/workspaces/${id}?userId=${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to delete workspace');
      toast.success('Workspace deleted successfully!');
      setWorkspaces((prev) => prev.filter((w) => w.workspaceId !== id));
    } catch (error) {
      console.error(error);
      toast.error('Error deleting workspace');
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Loading workspaces...</div>
      </DashboardLayout>
    );
  }

  // -----------------------------
  // 🔹 Render
  // -----------------------------
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground">
              Organize your mind maps into workspaces for better collaboration.
            </p>
          </div>
          <Button asChild>
            <Link href="/workspaces/new">
              <Plus className="h-4 w-4 mr-2" />
              New Workspace
            </Link>
          </Button>
        </div>

        {/* Workspaces Grid */}
        {workspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.workspaceId}
                className="hover:shadow-md transition-shadow group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Folder className="h-6 w-6 text-primary" />
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
                          <Link
                            href={`/workspaces/${workspace.workspaceId}/edit`}
                          >
                            Edit Workspace
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => handleDelete(workspace.workspaceId)}
                        >
                          Delete Workspace
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-xl">{workspace.name}</CardTitle>
                  <CardDescription>
                    {workspace.description || 'No description'}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">

                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatSafeDate(workspace.createdAt)}</span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/workspaces/${workspace.workspaceId}`}>
                        Open Workspace
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty State
          <Card className="text-center py-12">
            <CardContent>
              <Folder className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No workspaces yet</CardTitle>
              <CardDescription className="mb-6">
                Create your first workspace to start organizing your mind maps.
              </CardDescription>
              <Button asChild>
                <Link href="/workspaces/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workspace
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
