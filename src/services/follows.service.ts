import type { Follow } from '@/types/follow';
import { api } from './api';

type MessageResponse = { message: string };

export const followsService = {
	getFollowers: (userId: string, token?: string) =>
		api.get<Follow[]>(`/followers/${userId}`, token),

	getFollowing: (userId: string, token?: string) =>
		api.get<Follow[]>(`/following/${userId}`, token),

	follow: (
		data: { follower_id: string; following_id: string },
		token?: string,
	) => api.post<Follow>('/follows', data, token),

	unfollow: (followerId: string, followingId: string, token?: string) =>
		api.delete<MessageResponse>(`/follow/${followerId}/${followingId}`, token),
};
