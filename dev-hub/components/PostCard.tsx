"use client";

import { useState } from "react";

interface Post {
  id: string;
  user_id: string;
  content: string;
  type: "text" | "code" | "question" | "image";
  created_at: string;
  updated_at: string;
}

interface User {
  username: string;
  email: string;
}

const TYPE_LABELS: Record<string, string> = {
  text: "texto",
  code: "código",
  question: "pergunta",
  image: "imagem",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(user?: User) {
  if (user?.username) return user.username[0].toUpperCase();
  if (user?.email) return user.email[0].toUpperCase();
  return "?";
}

export default function PostCard({ post, user }: { post: Post; user?: User }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 20));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState("");

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
  };

  const submitComment = () => {
    if (commentText.trim().length < 2) return;
    setComments((prev) => [...prev, commentText.trim()]);
    setCommentText("");
  };

  return (
    <article className="w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-sm font-medium shrink-0">
          {initials(user)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.username ?? user?.email ?? post.user_id.slice(0, 8) + "..."}
          </p>
          <p className="text-xs text-zinc-500">{formatDate(post.created_at)}</p>
        </div>
        <span className="text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-zinc-400">
          {TYPE_LABELS[post.type] ?? post.type}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {post.type === "code" ? (
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 overflow-x-auto whitespace-pre-wrap">
            <code>{post.content}</code>
          </pre>
        ) : (
          <p className="text-zinc-200 text-sm leading-relaxed">{post.content}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5 px-4 pb-3">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-red-400" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <svg
            width="18" height="18" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="1.8"
            fill={liked ? "currentColor" : "none"}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{comments.length} {comments.length === 1 ? "comentário" : "comentários"}</span>
        </button>
      </div>

      {/* Comments (estático/local) */}
      {showComments && (
        <div className="border-t border-zinc-800 px-4 py-3 space-y-3 w-full overflow-hidden">
          {comments.length === 0 && (
            <p className="text-xs text-zinc-600">Nenhum comentário ainda.</p>
          )}
          {comments.map((c, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 shrink-0">
                VC
              </div>
              <div className="bg-zinc-900 rounded-lg px-3 py-2 flex-1">
                <p className="text-xs font-medium text-zinc-300 mb-0.5">você</p>
                <p className="text-sm text-zinc-300 leading-snug">{c}</p>
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-1 min-w-0">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitComment();
                }
              }}
              placeholder="Comentar... (Enter para enviar)"
              className="flex-1 bg-zinc-900 text-zinc-200 text-sm border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
            />
            <button
              onClick={submitComment}
              disabled={commentText.trim().length < 2}
              className="text-sm px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              Publicar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}