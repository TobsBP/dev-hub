export interface Comment {
	id: string;
	post_id: string;
	user_id: string;
	parent_id: string | null;
	content: string;
	created_at: string;
}

export type CommentCountMap = Record<string, number>;
