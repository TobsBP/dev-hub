'use client';

import { usePosts } from '@/hooks/usePosts';
import { useUsers } from '@/hooks/useUsers';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';

export default function Feed() {
	const { posts, loading, error, refetch } = usePosts();
	const { usersMap } = useUsers();

	return (
		<div className="max-w-xl mx-auto px-4 py-6">
			<h1 className="text-white font-semibold text-lg mb-5">Feed</h1>

			<CreatePostForm onPostCreated={refetch} />

			{loading && (
				<div className="space-y-4 mt-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-36 bg-zinc-900 rounded-xl animate-pulse"
						/>
					))}
				</div>
			)}

			{error && (
				<div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
					{error} —{' '}
					<button type="button" onClick={refetch} className="underline">
						tentar novamente
					</button>
				</div>
			)}

			{!loading && !error && posts.length === 0 && (
				<p className="text-zinc-500 text-sm text-center py-12">
					Nenhum post ainda. Seja o primeiro!
				</p>
			)}

			{!loading &&
				!error &&
				posts.map((post) => (
					<PostCard
						key={post.id}
						post={post}
						user={usersMap[post.user_id]}
						users={usersMap}
					/>
				))}
		</div>
	);
}
