import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white"> 
      <NavBar />
      <main className="flex flex-col items-center justify-center pt-20 gap-4">
        <h1 className="text-6xl font-extrabold tracking-tight">
          DevHub
        </h1>
        <p className="text-xl text-zinc-400 max-w-md text-center">
          The social network built <span className="text-blue-500">for</span> developers, <span className="text-blue-500">by</span> developers.
        </p>
      </main>
    </div>
  );
}