import type { User } from '@/types/user';
import { api } from './api';

type MessageResponse = { message: string };

export const usersService = {
	getAll: (token?: string) => api.get<User[]>('/users', token),

	getById: (id: string, token?: string) => api.get<User>(`/user/${id}`, token),

	create: (
		data: {
			username: string;
			email: string;
			password: string;
			bio?: string;
			avatar?: File;
		},
		token?: string,
	) => {
		const form = new FormData();
		form.append('username', data.username);
		form.append('email', data.email);
		form.append('password', data.password);
		if (data.bio) form.append('bio', data.bio);
		if (data.avatar) form.append('avatar', data.avatar);
		return api.postForm<MessageResponse>('/user', form, token);
	},

	update: (
		id: string,
		data: {
			username?: string;
			email?: string;
			bio?: string;
			avatar?: File;
		},
		token?: string,
	) => {
		const form = new FormData();
		if (data.username) form.append('username', data.username);
		if (data.email) form.append('email', data.email);
		if (data.bio !== undefined) form.append('bio', data.bio);
		if (data.avatar) form.append('avatar', data.avatar);
		return api.patchForm<MessageResponse>(`/user/${id}`, form, token);
	},

	delete: (id: string, token?: string) =>
		api.delete<MessageResponse>(`/user/${id}`, token),
};
