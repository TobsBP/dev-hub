export interface Comment {
	id: string;
	user_id: string;
	content: string;
	created_at: string;
}

export type CommentCountMap = Record<string, number>;
