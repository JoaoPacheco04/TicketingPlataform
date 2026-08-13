import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventList from '../components/EventList';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />
      <div className="relative border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-10">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Find your next unforgettable night
          </h1>
          <p className="text-zinc-400 text-lg">Browse live events and secure your seat in seconds.</p>
        </div>
      </div>
      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        <EventList />
      </main>
      <Footer />
    </div>
  );
}

export default App;