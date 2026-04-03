import Feed from '@/components/Feed';
import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white"> 
      <NavBar />
      <main className="flex flex-col items-center justify-center pt-20 gap-4">
        <Feed />;
      </main>
    </div>
  );
}