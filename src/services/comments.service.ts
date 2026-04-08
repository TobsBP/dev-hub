import type { Comment } from '@/types/comment';
import { api } from './api';

type MessageResponse = { message: string };

export const commentsService = {
	getByPost: (postId: string, token?: string) =>
		api.get<Comment[]>(`/comments/${postId}`, token),

	getById: (id: string, token?: string) =>
		api.get<Comment>(`/comment/${id}`, token),

	create: (
		data: {
			post_id: string;
			user_id: string;
			parent_id: string | null;
			content: string;
		},
		token?: string,
	) => api.post<MessageResponse>('/comments', data, token),

	update: (id: string, content: string, token?: string) =>
		api.patch<Comment>(`/comment/${id}`, { content }, token),

	delete: (id: string, token?: string) =>
		api.delete<MessageResponse>(`/comment/${id}`, token),
};
