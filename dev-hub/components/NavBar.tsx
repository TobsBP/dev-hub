'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function NavBar() {
	const [mounted, setMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [initials, setInitials] = useState('?');
	const [typedText, setTypedText] = useState('');
	const [doneTyping, setDoneTyping] = useState(false);
	const { data: session } = useSession();

	useEffect(() => {
		setMounted(true);
	}, []);

	const FULL_TEXT = 'DevHub';

	useEffect(() => {
		let i = 0;
		setTypedText('');
		setDoneTyping(false);
		const interval = setInterval(() => {
			i++;
			setTypedText(FULL_TEXT.slice(0, i));
			if (i === FULL_TEXT.length) {
				clearInterval(interval);
				setDoneTyping(true);
			}
		}, 120);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!session?.user?.id) return;
		fetch(`/api/users/${session.user.id}`)
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (!data) return;
				setAvatarUrl(data.avatar_url ?? null);
				setInitials(
					(data.username?.[0] ?? session.user?.email?.[0] ?? '?').toUpperCase(),
				);
			})
			.catch(() => {});
	}, [session]);
	const router = useRouter();

	const handleSearch = (e: React.BaseSyntheticEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/pesquisar?q=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<nav className="bg-black shadow-md w-full z-20 top-0 left-0 border-b border-zinc-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<div className="shrink-0">
						<Link href="/" className="flex items-center">
							<span className="text-2xl font-bold tracking-tight text-white">
								{mounted ? (
									<>
										{typedText}
										{!doneTyping && <span className="animate-pulse">|</span>}
									</>
								) : (
									'DevHub'
								)}
							</span>
						</Link>
					</div>

					{/* Barra de Pesquisa Desktop */}
					<div className="hidden md:flex flex-1 justify-center px-8">
						<form onSubmit={handleSearch} className="relative w-full max-w-md">
							<input
								type="text"
								placeholder="Pesquisar desenvolvedores ou projetos..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full bg-zinc-900 text-zinc-100 text-sm border border-zinc-800 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-white transition-all"
							/>
							<div className="absolute left-3 top-2.5 text-zinc-500">
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Search</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</form>
					</div>

					{/* Ações (Perfil/Menu) */}
					<div className="flex items-center space-x-4">
						<div className="hidden md:block">
							<Link href="/perfil" className="block">
								<div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-sm font-medium overflow-hidden ring-2 ring-transparent hover:ring-zinc-600 transition-all">
									{mounted && avatarUrl ? (
										<Image
											src={avatarUrl}
											alt="Avatar"
											width={36}
											height={36}
											className="w-full h-full object-cover"
										/>
									) : mounted ? (
										initials
									) : (
										'?'
									)}
								</div>
							</Link>
						</div>

						{/* Botão Mobile */}
						<div className="md:hidden flex items-center">
							<button
								type="button"
								onClick={() => setIsOpen(!isOpen)}
								className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white focus:outline-none"
							>
								<svg
									className="h-6 w-6"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 24 24"
								>
									<title>{isOpen ? 'Fechar' : 'Menu'}</title>
									{isOpen ? (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									) : (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									)}
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Menu Mobile */}
			<div
				className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-black border-t border-zinc-800 pb-4`}
			>
				<div className="px-4 py-3">
					<form onSubmit={handleSearch} className="relative w-full">
						<input
							type="text"
							placeholder="Pesquisar..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-md py-2 px-3 focus:outline-none"
						/>
					</form>
				</div>
				<div className="flex flex-col px-4 space-y-2">
					<Link href="/perfil" className="flex items-center gap-3 py-2">
						<div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-sm font-medium overflow-hidden shrink-0">
							{avatarUrl ? (
								<Image
									src={avatarUrl}
									alt="Avatar"
									width={32}
									height={32}
									className="w-full h-full object-cover"
								/>
							) : (
								initials
							)}
						</div>
						<span className="text-white font-semibold">Perfil</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}
