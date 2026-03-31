import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">DevHub</h1>
        <p className="text-zinc-600">Social Network for Developers by Developers</p>
      </main>
    </div>
  );
}