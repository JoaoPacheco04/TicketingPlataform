import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventList from "./components/EventList";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        <h1 className="text-3xl font-bold text-white mb-1">Upcoming events</h1>
        <p className="text-zinc-400 mb-8">Find and book your next experience.</p>
        <EventList />
      </main>
      <Footer />
    </div>
  );
}

export default App;