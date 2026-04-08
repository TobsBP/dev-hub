'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

const AUTH_PATHS = ['/login', '/register'];

export default function ConditionalNavBar() {
	const pathname = usePathname();

	if (AUTH_PATHS.includes(pathname)) return null;

	return <NavBar />;
}
