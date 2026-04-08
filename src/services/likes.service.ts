import type { Like, LikeTargetType } from '@/types/like';
import { api } from './api';

type MessageResponse = { message: string };

export const likesService = {
	getByTarget: (targetType: LikeTargetType, targetId: string, token?: string) =>
		api.get<Like[]>(`/likes/${targetType}/${targetId}`, token),

	like: (
		data: { user_id: string; target_type: LikeTargetType; target_id: string },
		token?: string,
	) => api.post<Like>('/likes', data, token),

	unlike: (
		userId: string,
		targetType: LikeTargetType,
		targetId: string,
		token?: string,
	) => api.delete<MessageResponse>(`/like/${userId}/${targetType}/${targetId}`, token),
};
