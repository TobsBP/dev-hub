export type LikeTargetType = 'post' | 'comment';

export interface Like {
	id: string;
	user_id: string;
	target_type: LikeTargetType;
	target_id: string;
	created_at: string;
}
