import { User, Workspace, Mindmap, Payment } from './types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
  plan: 'free',
  createdAt: '2024-01-01T00:00:00Z',
};

export const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Personal Projects',
    description: 'My personal mindmaps and ideas',
    userId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    mindmapsCount: 5,
  },
  {
    id: '2',
    name: 'Work Plans',
    description: 'Professional mindmaps for work',
    userId: '1',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    mindmapsCount: 3,
  },
  {
    id: '3',
    name: 'Learning Notes',
    description: 'Educational content and study materials',
    userId: '1',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    mindmapsCount: 8,
  },
];

export const mockMindmaps: Mindmap[] = [
  {
    id: '1',
    title: 'Project Planning',
    workspaceId: '1',
    userId: '1',
    data: {},
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Marketing Strategy',
    workspaceId: '2',
    userId: '1',
    data: {},
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
];

export const mockUsers: User[] = [
  mockUser,
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    plan: 'premium',
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    plan: 'premium',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    userId: '2',
    amount: 99000,
    status: 'verified',
    createdAt: '2024-01-10T00:00:00Z',
    plan: 'premium',
  },
  {
    id: '2',
    userId: '1',
    amount: 99000,
    status: 'pending',
    createdAt: '2024-01-15T00:00:00Z',
    plan: 'premium',
  },
];