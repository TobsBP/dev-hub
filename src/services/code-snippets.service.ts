import type { CodeSnippet } from '@/types/code-snippet';
import { api } from './api';

type MessageResponse = { message: string };

export const codeSnippetsService = {
	getByPost: (postId: string, token?: string) =>
		api.get<CodeSnippet[]>(`/code-snippets/${postId}`, token),

	getById: (id: string, token?: string) =>
		api.get<CodeSnippet>(`/code-snippet/${id}`, token),

	create: (
		data: { post_id: string; language?: string | null; code: string },
		token?: string,
	) => api.post<CodeSnippet>('/code-snippets', data, token),

	update: (
		id: string,
		data: { language?: string | null; code?: string },
		token?: string,
	) => api.patch<MessageResponse>(`/code-snippet/${id}`, data, token),

	delete: (id: string, token?: string) =>
		api.delete<MessageResponse>(`/code-snippet/${id}`, token),
};
