import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-6 gap-4">
      <Ticket className="text-zinc-700" size={48} />
      <h1 className="text-3xl font-bold text-white">404</h1>
      <p className="text-zinc-400 text-center">This page doesn't exist — maybe the event sold out?</p>
      <Link to="/" className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
        Back to events
      </Link>
    </div>
  );
}

export default NotFoundPage;