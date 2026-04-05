"use client";

import { signOut, useSession } from "next-auth/react";

export default function PerfilPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-2xl font-bold">
        {session?.user?.name?.[0]?.toUpperCase() ?? session?.user?.email?.[0]?.toUpperCase() ?? "?"}
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold">{session?.user?.name ?? "—"}</p>
        <p className="text-zinc-400 text-sm">{session?.user?.email ?? "—"}</p>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
      >
        Sair
      </button>
    </div>
  );
}
