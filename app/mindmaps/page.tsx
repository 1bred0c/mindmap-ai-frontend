'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockMindmaps, mockWorkspaces } from '@/lib/mock-data';
import { Plus, Brain, Search, MoveHorizontal as MoreHorizontal, Calendar, Folder } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

export default function MindmapsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredMindmaps = mockMindmaps.filter(mindmap =>
    mindmap.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getWorkspaceName = (workspaceId: string) => {
    return mockWorkspaces.find(w => w.id === workspaceId)?.name || 'Unknown';
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mind Maps</h1>
            <p className="text-muted-foreground">
              All your mind maps across different workspaces.
            </p>
          </div>
          <Button asChild>
            <Link href="/mindmaps/new">
              <Plus className="h-4 w-4 mr-2" />
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
            <Card key={mindmap.id} className="hover:shadow-md transition-shadow group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/mindmaps/${mindmap.id}/edit`}>
                          Edit Mind Map
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Mind Map
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg">{mindmap.title}</CardTitle>
                <CardDescription>
                  Last modified {formatDistanceToNow(new Date(mindmap.updatedAt), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {getWorkspaceName(mindmap.workspaceId)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created {formatDistanceToNow(new Date(mindmap.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/mindmaps/${mindmap.id}`}>
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
                  : 'Create your first mind map to get started.'
                }
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