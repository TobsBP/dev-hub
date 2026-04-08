export interface Post {
	id: string;
	user_id: string;
	content: string;
	image_url?: string;
	type: 'text' | 'code' | 'question' | 'image';
	created_at: string;
	updated_at: string;
}
