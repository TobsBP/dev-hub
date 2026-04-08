import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import SessionWrapper from '@/components/SessionWrapper';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'DevHub',
	description: 'Social Network for Developers by Developers',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="antialiased">
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50`}
			>
				<SessionWrapper>{children}</SessionWrapper>
			</body>
		</html>
	);
}
