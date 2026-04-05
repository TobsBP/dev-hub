"use client";

import { useState } from "react";

interface CreatePostFormProps {
  onPostCreated?: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  const [userId, setUserId] = useState("00000000-0000-0000-0000-000000000000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (content.trim().length < 5) {
      setError("Post deve ter pelo menos 5 caracteres");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, content, type }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar post");
      }

      setSuccess(true);
      setContent("");
      setType("text");

      setTimeout(() => setSuccess(false), 2000);

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-zinc-800 rounded-lg bg-zinc-950">
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="O que você está desenvolvendo?"
          rows={3}
          className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-md p-3 focus:outline-none focus:border-blue-500 resize-none"
          disabled={loading}
        />

        <div className="flex gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 bg-zinc-900 text-white border border-zinc-800 rounded-md p-2 focus:outline-none focus:border-blue-500"
            disabled={loading}
          >
            <option value="text">Texto</option>
            <option value="code">Código</option>
            <option value="question">Pergunta</option>
            <option value="image">Imagem</option>
          </select>

          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="flex-1 bg-zinc-900 text-white border border-zinc-800 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">✓ Post criado com sucesso!</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-2 rounded-md transition-colors"
        >
          {loading ? "Postando..." : "Postar"}
        </button>
      </div>
    </form>
  );
}