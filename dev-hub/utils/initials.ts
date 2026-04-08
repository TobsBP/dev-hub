import type { User } from '@/types/user';

export function initials(user?: User): string {
	if (user?.username) return user.username[0].toUpperCase();
	if (user?.email) return user.email[0].toUpperCase();
	return '?';
}
