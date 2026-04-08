'use client';

import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';

interface CreatePostFormProps {
	onPostCreated?: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
	const { data: session } = useSession();
	const [content, setContent] = useState('');
	const [type, setType] = useState('text');
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function handleTypeChange(value: string) {
		setType(value);
		if (value !== 'image') {
			setImage(null);
			setPreview(null);
		}
	}

	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] ?? null;
		setImage(file);
		if (file) {
			setPreview(URL.createObjectURL(file));
		} else {
			setPreview(null);
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		if (type !== 'image' && content.trim().length < 5) {
			setError('Post deve ter pelo menos 5 caracteres');
			return;
		}
		if (type === 'image' && !image) {
			setError('Selecione uma imagem');
			return;
		}

		setLoading(true);
		try {
			const formData = new FormData();
			formData.append('user_id', session?.user?.id ?? '');
			formData.append('content', content.trim());
			formData.append('type', type);
			if (image) formData.append('image', image);

			const response = await fetch('/api/posts', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) throw new Error('Erro ao criar post');

			setSuccess(true);
			setContent('');
			setType('text');
			setImage(null);
			setPreview(null);
			if (fileInputRef.current) fileInputRef.current.value = '';

			setTimeout(() => setSuccess(false), 2000);
			onPostCreated?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro desconhecido');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mb-6 p-4 border border-zinc-800 rounded-lg bg-zinc-950"
		>
			<div className="space-y-3">
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder={
						type === 'image'
							? 'Legenda (opcional)...'
							: 'O que você está desenvolvendo?'
					}
					rows={3}
					className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-md p-3 focus:outline-none focus:border-blue-500 resize-none"
					disabled={loading}
				/>

				<div className="flex gap-3">
					<select
						value={type}
						onChange={(e) => handleTypeChange(e.target.value)}
						className="flex-1 bg-zinc-900 text-white border border-zinc-800 rounded-md p-2 focus:outline-none focus:border-blue-500"
						disabled={loading}
					>
						<option value="text">Texto</option>
						<option value="code">Código</option>
						<option value="question">Pergunta</option>
						<option value="image">Imagem</option>
					</select>
				</div>

				{type === 'image' && (
					<div className="space-y-2">
						<label
							htmlFor="post-image"
							className="flex items-center justify-center gap-2 w-full border border-dashed border-zinc-700 rounded-md p-3 cursor-pointer text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
							>
								<title>Selecionar imagem</title>
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<circle cx="8.5" cy="8.5" r="1.5" />
								<path d="M21 15l-5-5L5 21" />
							</svg>
							<span className="text-sm">
								{image ? image.name : 'Selecionar imagem'}
							</span>
						</label>
						<input
							id="post-image"
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="sr-only"
							disabled={loading}
						/>
						{preview && (
							<div className="relative">
								{/* biome-ignore lint/performance/noImgElement: preview local, sem otimização Next necessária */}
								<img
									src={preview}
									alt="Preview"
									className="w-full max-h-64 object-cover rounded-md border border-zinc-800"
								/>
								<button
									type="button"
									onClick={() => {
										setImage(null);
										setPreview(null);
										if (fileInputRef.current) fileInputRef.current.value = '';
									}}
									className="absolute top-2 right-2 bg-zinc-900 border border-zinc-700 rounded-full w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-xs"
								>
									✕
								</button>
							</div>
						)}
					</div>
				)}

				{error && <p className="text-red-500 text-sm">{error}</p>}
				{success && (
					<p className="text-green-500 text-sm">✓ Post criado com sucesso!</p>
				)}

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-2 rounded-md transition-colors"
				>
					{loading ? 'Postando...' : 'Postar'}
				</button>
			</div>
		</form>
	);
}
