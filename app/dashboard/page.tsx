'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Folder, Brain, Users, TrendingUp, Plus, Zap } from 'lucide-react'
import Link from 'next/link'

// ==== Types ====
type Workspace = {
  workspace_id: number
  name: string
  description: string | null
  type: string | null
  owner_id: number
  created_at: string
}

type Mindmap = {
  mind_map_id: number
  workspace_id: number | null
  title: string
  owner_id: number
  is_public: boolean
  created_at: string
}

type WorkspaceMember = {
  workspaceid: number
  userid: number
  permission: string
}

// ==== Component ====
export default function DashboardPage() {
  const [userId, setUserId] = useState<number | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [mindmaps, setMindmaps] = useState<Mindmap[]>([])
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [loading, setLoading] = useState(true)

  // ==== Lấy userId từ localStorage ====
  // ==== Lấy userId từ localStorage ====
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.userId) {
          setUserId(Number(parsed.userId))
        } else {
          console.warn('⚠️ userid not found in user object')
        }
      } catch (err) {
        console.error('⚠️ Failed to parse user from localStorage', err)
      }
    } else {
      console.warn('⚠️ user not found in localStorage')
    }
  }, [])


  // ==== Fetch data từ Supabase theo userId ====
  useEffect(() => {
    if (!userId) return
    const fetchData = async () => {
      setLoading(true)
      try {
        // Lấy các workspace mà user sở hữu hoặc là thành viên
        const { data: ownedWs, error: wsErr1 } = await supabase
          .from('workspaces')
          .select('*')
          .eq('owner_id', userId)

        const { data: joinedWs, error: wsErr2 } = await supabase
          .from('workspacemembers')
          .select('workspaceid')
          .eq('userid', userId)

        const allWorkspaceIds = [
          ...(ownedWs?.map((w) => w.workspace_id) || []),
          ...(joinedWs?.map((j) => j.workspaceid) || []),
        ]
        const uniqueIds = Array.from(new Set(allWorkspaceIds))

        const { data: allWorkspaces, error: wsErr3 } = await supabase
          .from('workspaces')
          .select('*')
          .in('workspace_id', uniqueIds)

        // Lấy mindmaps do user sở hữu hoặc thuộc workspace của user
        const { data: userMindmaps, error: mmErr } = await supabase
          .from('mindmaps')
          .select('*')
          .or(
            `owner_id.eq.${userId},workspace_id.in.(${uniqueIds.join(',') || '0'})`
          )

        // Lấy các thành viên trong những workspace đó
        const { data: membersData, error: memErr } = await supabase
          .from('workspacemembers')
          .select('*')
          .in('workspaceid', uniqueIds)

        if (wsErr1 || wsErr2 || wsErr3) console.error('Workspace fetch error', wsErr1 || wsErr2 || wsErr3)
        if (mmErr) console.error('Mindmap fetch error', mmErr)
        if (memErr) console.error('Members fetch error', memErr)

        setWorkspaces(allWorkspaces || [])
        setMindmaps(userMindmaps || [])
        setMembers(membersData || [])
      } catch (err) {
        console.error('Unexpected fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // ==== Derived statistics ====
  const stats = [
    {
      title: 'Total Workspaces',
      value: loading ? '...' : workspaces.length.toString(),
      icon: Folder,
    },
    {
      title: 'Total Mind Maps',
      value: loading ? '...' : mindmaps.length.toString(),
      icon: Brain,
    },
    {
      title: 'Collaborators',
      value: loading ? '...' : members.length.toString(),
      icon: Users,
    },
    {
      title: 'Views',
      value: '—',
      icon: TrendingUp,
    },
  ]

  // ==== Recent workspaces ====
  const recentWorkspaces = [...workspaces]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* ==== Header ==== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-400">
              Welcome back! Navigate your neural network of ideas.
            </p>
          </div>
          <Button asChild className="mt-4 sm:mt-0 group">
            <Link href="/workspaces/new">
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
              New Workspace
            </Link>
          </Button>
        </div>

        {/* ==== Stats ==== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="group relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-4 w-4 text-cyan-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {stat.value}
                </div>
              </CardContent>
              
              {/* Glow line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* ==== Recent Workspaces & Quick Actions ==== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ==== Recent Workspaces ==== */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Folder className="h-5 w-5 text-cyan-400" />
                Recent Workspaces
              </CardTitle>
              <CardDescription>Your most recently updated neural networks</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : recentWorkspaces.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No workspaces found.</p>
              ) : (
                <div className="space-y-3">
                  {recentWorkspaces.map((ws) => (
                    <div
                      key={ws.workspace_id}
                      className="group flex items-center justify-between p-4 rounded-lg border border-white/5 hover:border-purple-500/30 bg-card/30 hover:bg-card/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Folder className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{ws.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(ws.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/workspaces/${ws.workspace_id}`}>
                          View →
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/workspaces">View All Workspaces</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ==== Quick Actions ==== */}
          <Card className="relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
            
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                Quick Actions
              </CardTitle>
              <CardDescription>Launch into creation mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start group" asChild>
                  <Link href="/workspaces/new">
                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
                    Create New Workspace
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start group" asChild>
                  <Link href="/ai">
                    <Brain className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                    Generate AI Mind Map
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start group" asChild>
                  <Link href="/mindmaps/new">
                    <Brain className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                    Create Mind Map
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start group" asChild>
                  <Link href="/pricing">
                    <TrendingUp className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                    Upgrade to Premium
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
