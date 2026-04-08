export interface User {
	username: string;
	email: string;
	bio?: string;
	avatar_url?: string;
}

export type UserMap = Record<string, User>;
