'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Plus, Brain, Search, MoveHorizontal as MoreHorizontal, Calendar, Folder
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// ✅ Type định nghĩa đúng theo API trả về
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

// ✅ Base API URL
const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080/api/v1';

export default function MindmapsPage() {
  const [mindmaps, setMindmaps] = useState<Mindmap[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  // 🔹 Fetch mindmaps khi page load
  useEffect(() => {
    const fetchMindmaps = async () => {
      try {
        const userData = localStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        const userId = parsedUser?.userId ?? 1;
        setUserId(parsedUser?.userId ?? null);
        const res = await fetch(`${API_ENDPOINT}/mindmap/owner/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch mindmaps');
        const data = await res.json();
        setMindmaps(data);
      } catch (error) {
        console.error(error);
        toast.error('Cannot load mind maps');
      } finally {
        setLoading(false);
      }
    };

    fetchMindmaps();
  }, []);

  // 🔹 Lọc theo từ khóa
  const filteredMindmaps = mindmaps.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Loading UI
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-10 w-48 bg-card/50 rounded-lg animate-shimmer" />
              <div className="h-4 w-64 bg-card/50 rounded-lg animate-shimmer" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-card/50 p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-3/4 bg-card/80 rounded animate-shimmer" />
                    <div className="h-4 w-1/2 bg-card/80 rounded animate-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Mind Maps
              </span>
            </h1>
            <p className="text-gray-400">
              Navigate your neural network of interconnected ideas
            </p>
          </div>
          <Button asChild className="group mt-4 sm:mt-0">
            <Link href="/mindmaps/new">
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Mind Map
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search mind maps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mind Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMindmaps.map((mindmap) => (
            <Card key={mindmap.mindMapId} className="group hover-lift relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-6 w-6 text-cyan-400" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/mindmaps/${mindmap.mindMapId}/edit`}>
                          Edit Mind Map
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
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
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Workspace {mindmap.title}
                    </span>
                  </div>
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

        {/* Empty State */}
        {filteredMindmaps.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">
                {searchQuery ? 'No mind maps found' : 'No mind maps yet'}
              </CardTitle>
              <CardDescription className="mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms.'
                  : 'Create your first mind map to get started.'}
              </CardDescription>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/mindmaps/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Mind Map
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
