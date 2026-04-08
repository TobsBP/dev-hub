import type { Tag } from '@/types/tag';
import { api } from './api';

type MessageResponse = { message: string };

export const tagsService = {
	getAll: (token?: string) => api.get<Tag[]>('/tags', token),

	getById: (id: string, token?: string) => api.get<Tag>(`/tag/${id}`, token),

	getByPost: (postId: string, token?: string) =>
		api.get<Tag[]>(`/tags/${postId}`, token),

	create: (name: string, token?: string) =>
		api.post<MessageResponse>('/tags', { name }, token),

	addToPost: (postId: string, tagId: string, token?: string) =>
		api.post<MessageResponse>(`/tag/${postId}/${tagId}`, {}, token),

	removeFromPost: (postId: string, tagId: string, token?: string) =>
		api.delete<MessageResponse>(`/tag/${postId}/${tagId}`, token),

	delete: (id: string, token?: string) =>
		api.delete<MessageResponse>(`/tag/${id}`, token),
};
