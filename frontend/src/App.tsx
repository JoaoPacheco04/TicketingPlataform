import Navbar from "./components/Navbar";
import EventList from "./components/EventList";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-1">Upcoming events</h1>
        <p className="text-zinc-400 mb-8">Find and book your next experience.</p>
        <EventList />
      </main>
    </div>
  );
}

export default App;