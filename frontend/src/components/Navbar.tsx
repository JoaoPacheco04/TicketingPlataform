import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Ticket, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

function Navbar() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setMenuOpen(false);
  }

  const links = token
    ? [
        { to: '/my-reservations', label: 'My tickets' },
        ...(role === 'Organizer'
          ? [
              { to: '/organizer', label: 'Organizer' },
              { to: '/checkin', label: 'Check-in' },
            ]
          : []),
        { to: '/profile', label: 'Profile' },
      ]
    : [];

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-zinc-900/80 border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Ticket size={24} className="text-cyan-400" aria-hidden="true" />
          <span>TicketFlow</span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center text-sm">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-zinc-300 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
          {token ? (
            <button onClick={handleLogout} className="text-zinc-300 hover:text-white transition-colors">
              Log out
            </button>
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

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-zinc-800 px-6 py-4 flex flex-col gap-3 text-sm">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {token ? (
            <button onClick={handleLogout} className="text-left text-zinc-300 hover:text-white">
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
