import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '../api/auth';
import { useAuthStore } from '../store/authStore';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await login({ email, password });
      setToken(response.token);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-zinc-950">
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80"
          alt="Concert crowd"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Ticket className="text-cyan-400" size={30} aria-hidden="true" />
            TicketFlow
          </p>
          <p className="text-zinc-300">Discover and book the best events near you, in seconds.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-zinc-400 text-sm mt-1">Log in to book your next event.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2.5 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

          <p className="text-sm text-zinc-400 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
