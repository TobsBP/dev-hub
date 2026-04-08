export interface User {
	id: string;
	username: string;
	email: string;
	bio: string | null;
	role: string | null;
	avatar_url: string | null;
	created_at: string;
}

export type UserMap = Record<string, User>;
