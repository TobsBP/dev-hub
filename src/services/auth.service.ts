import { api } from './api';

export type AuthResponse = { token: string; expireAt: string };

export const authService = {
	login: (email: string, password: string) =>
		api.post<AuthResponse>('/auth/login', { email, password }),

	register: (data: {
		username: string;
		email: string;
		password: string;
		bio?: string;
		avatar?: File;
	}) => {
		const form = new FormData();
		form.append('username', data.username);
		form.append('email', data.email);
		form.append('password', data.password);
		if (data.bio) form.append('bio', data.bio);
		if (data.avatar) form.append('avatar', data.avatar);
		return api.postForm<AuthResponse>('/auth/register', form);
	},
};
