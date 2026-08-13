import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

function Navbar() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-zinc-900/80 border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
          🎟️ <span>TicketFlow</span>
        </Link>

        <nav className="flex gap-6 items-center text-sm">
          {token ? (
            <>
              {role === 'Organizer' && (
                <Link to="/checkin" className="text-zinc-300 hover:text-white transition-colors">
                  Check-in
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-zinc-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;