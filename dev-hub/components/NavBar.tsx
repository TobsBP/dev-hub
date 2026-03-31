"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black shadow-md w-full z-20 top-0 left-0 border-b border-zinc-800">
      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight text-white">
                DevHub
              </span>
            </Link>
          </div>

          {/* Links Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {/* Ajustado: text-zinc-400 com hover:text-white para contraste no fundo preto */}
              <Link href="/projetos" className="text-zinc-400 hover:text-white px-3 py-2 font-medium transition-colors">Projetos</Link>
              <Link href="/sobre" className="text-zinc-400 hover:text-white px-3 py-2 font-medium transition-colors">Sobre</Link>
              {/* Ajustado: bg-white com texto preto para o botão se destacar no fundo escuro */}
              <Link href="/contato" className="bg-white text-black px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors font-semibold">
                Contato
              </Link>
            </div>
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-black border-t border-zinc-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
          <Link href="/projetos" className="block text-zinc-400 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-md">Projetos</Link>
          <Link href="/sobre" className="block text-zinc-400 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-md">Sobre</Link>
          <Link href="/contato" className="block bg-white text-black px-3 py-2 rounded-md font-semibold mx-4 my-2">Contato</Link>
        </div>
      </div>
    </nav>
  );
}