import Feed from '@/components/Feed';
import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white"> 
      <NavBar />
      <main className="w-full pt-6">
        <Feed />
      </main>
    </div>
  );
}