import { Link } from 'react-router-dom';
import EventList from "./components/EventList";
import { useAuthStore } from './store/authStore';

function App() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Ticketing Platform 🎟️</h1>

        <div className="flex gap-4">
          {token ? (
            <button onClick={logout} className="text-white hover:underline">
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-white hover:underline">
                Log in
              </Link>
              <Link to="/register" className="text-white hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
      <EventList />
    </div>
  );
}

export default App;