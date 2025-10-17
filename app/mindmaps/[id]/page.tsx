import MindMapPageClient from './MindMapPageClient';
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';

export default async function MindMapPage({ params, searchParams }: any) {
  const mindMapId = params.id;
  const userId = searchParams.userId; // ✅ nhận userId khi redirect

  // 🧠 1. Lấy mindmap
  const { data: mindmap, error } = await supabase
    .from('mindmaps')
    .select('*')
    .eq('mind_map_id', mindMapId)
    .single();

  if (error || !mindmap) {
    console.error('❌ Failed to load mindmap:', error?.message);
    notFound();
  }

  // 🧩 2. Lấy quyền của user từ workspace_members
  const { data: member, error: memberError } = await supabase
    .from('workspace_members')
    .select('permission')
    .eq('workspace_id', mindmap.workspace_id)
    .eq('userid', userId)
    .single();


  // 🔹 3. Tính toán viewOnly = true nếu chỉ có quyền view_only
  const permission = member?.permission?.toUpperCase();
  console.log('🔎 Workspace permission:', permission);
  console.log('memberError:', memberError);
  console.log('member:', member);
  console.log('userId:', userId);
  console.log('workspace_id:', mindmap.workspace_id);

  const isOwner = mindmap.owner_id === Number(userId);

  var viewOnly = true;
  if (isOwner || permission === 'EDIT') {
    viewOnly = false;
  }


  // ✅ 4. Truyền xuống Client
  return (
    <MindMapPageClient
      mindmap={mindmap}
      mindmapId={mindmap.mind_map_id}
      viewOnly={viewOnly}
    />
  );
}
