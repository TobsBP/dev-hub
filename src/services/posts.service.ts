import type { Post } from '@/types/post';
import { api } from './api';

type MessageResponse = { message: string };

export const postsService = {
	getAll: (token?: string) => api.get<Post[]>('/posts', token),

	getById: (id: string, token?: string) => api.get<Post>(`/post/${id}`, token),

	getByUser: (userId: string, token?: string) =>
		api.get<Post[]>(`/posts/${userId}`, token),

	create: (
		data: { user_id: string; content: string; type: string; image?: File },
		token?: string,
	) => {
		const form = new FormData();
		form.append('user_id', data.user_id);
		form.append('content', data.content);
		form.append('type', data.type);
		if (data.image) form.append('image', data.image);
		return api.postForm<MessageResponse>('/post', form, token);
	},

	update: (
		id: string,
		data: {
			user_id?: string;
			content?: string;
			type?: string;
			image_url?: string | null;
		},
		token?: string,
	) => api.patch<Post>(`/post/${id}`, data, token),

	delete: (id: string, token?: string) =>
		api.delete<MessageResponse>(`/post/${id}`, token),
};
