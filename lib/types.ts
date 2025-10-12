export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  plan: 'free' | 'premium';
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  mindmapsCount: number;
}

export interface Mindmap {
  id: string;
  title: string;
  workspaceId: string;
  userId: string;
  data: any; // React Flow data
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'verified' | 'rejected';
  receiptUrl?: string;
  createdAt: string;
  plan: 'premium';
}