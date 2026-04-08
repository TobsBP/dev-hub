export interface User {
	username: string;
	email: string;
}

export type UserMap = Record<string, User>;
