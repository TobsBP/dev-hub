"use client";

import { useCallback, useEffect, useState } from "react";
import CreatePostForm from "./CreatePostForm";
import PostCard from "./PostCard";

export interface Post {
  id: string;
  user_id: string;
  content: string;
  type: "text" | "code" | "question" | "image";
  created_at: string;
  updated_at: string;
}

export interface UserMap {
  [id: string]: { username: string; email: string };
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsRes, usersRes] = await Promise.all([
        fetch("/api/posts"),
        fetch("/api/users"),
      ]);
      if (!postsRes.ok) throw new Error("Erro ao buscar posts");
      const data: Post[] = await postsRes.json();
      setPosts(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const map: UserMap = {};
        for (const u of usersData) map[u.id] = { username: u.username, email: u.email };
        setUsers(map);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-white font-semibold text-lg mb-5">Feed</h1>

      <CreatePostForm onPostCreated={fetchPosts} />

      {loading && (
        <div className="space-y-4 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
          {error} —{" "}
          <button onClick={fetchPosts} className="underline">tentar novamente</button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="text-zinc-500 text-sm text-center py-12">Nenhum post ainda. Seja o primeiro!</p>
      )}

      {!loading && !error && posts.map((post) => (
        <PostCard key={post.id} post={post} user={users[post.user_id]} />
      ))}
    </div>
  );
}