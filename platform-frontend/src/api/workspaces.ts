import type { ContentItem, ContentTaskRequest, Idea } from '../features/workspaces/boardTypes';
import type { MyWorkspace, WorkspaceMember, WorkspaceMemberRole } from '../features/workspaces/types';
import { apiRequest } from './http';

export interface BoardPayload {
  items: ContentItem[];
  ideas: Idea[];
  taskRequests: ContentTaskRequest[];
}

export async function fetchWorkspaces(): Promise<MyWorkspace[]> {
  const data = await apiRequest<{ items: MyWorkspace[] }>('/api/workspaces');
  return data.items;
}

export async function createWorkspace(input: Omit<MyWorkspace, 'id' | 'ownerUserId' | 'createdAt'>): Promise<MyWorkspace> {
  const data = await apiRequest<{ workspace: MyWorkspace }>('/api/workspaces', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.workspace;
}

export async function updateWorkspace(
  workspaceId: string,
  input: Pick<MyWorkspace, 'name' | 'description' | 'purpose' | 'channels' | 'format' | 'templateKey' | 'preset' | 'items'>,
): Promise<MyWorkspace> {
  const data = await apiRequest<{ workspace: MyWorkspace }>(`/api/workspaces/${workspaceId}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.workspace;
}

export function fetchBoard(workspaceId: string): Promise<BoardPayload> {
  return apiRequest<BoardPayload>(`/api/workspaces/${workspaceId}/board`);
}

export function syncBoard(workspaceId: string, data: BoardPayload): Promise<BoardPayload> {
  return apiRequest<BoardPayload>(`/api/workspaces/${workspaceId}/board`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteWorkspace(workspaceId: string): Promise<{ deleted: boolean }> {
  return apiRequest<{ deleted: boolean }>(`/api/workspaces/${workspaceId}/delete`, {
    method: 'POST',
  });
}

export async function fetchWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const data = await apiRequest<{ items: WorkspaceMember[] }>(`/api/workspaces/${workspaceId}/members`);
  return data.items;
}

export async function addWorkspaceMember(workspaceId: string, email: string): Promise<WorkspaceMember[]> {
  const data = await apiRequest<{ items: WorkspaceMember[] }>(`/api/workspaces/${workspaceId}/members`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return data.items;
}

export async function updateWorkspaceMemberRole(
  workspaceId: string,
  userId: number,
  role: WorkspaceMemberRole,
): Promise<WorkspaceMember[]> {
  const data = await apiRequest<{ items: WorkspaceMember[] }>(`/api/workspaces/${workspaceId}/members/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
  return data.items;
}

export async function removeWorkspaceMember(workspaceId: string, userId: number): Promise<WorkspaceMember[]> {
  const data = await apiRequest<{ items: WorkspaceMember[] }>(`/api/workspaces/${workspaceId}/members/${userId}/delete`, {
    method: 'POST',
  });
  return data.items;
}
