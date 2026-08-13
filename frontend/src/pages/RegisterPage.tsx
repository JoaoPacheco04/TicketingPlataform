import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { register } from '../api/auth';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Customer' | 'Organizer'>('Customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({ fullName, email, password, role });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch {
      toast.error('Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-zinc-950">
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
          alt="Live event stage"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Ticket className="text-cyan-400" size={30} aria-hidden="true" />
            TicketFlow
          </p>
          <p className="text-zinc-300">Join thousands of people booking events every day.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-zinc-400 text-sm mt-1">Start booking events in minutes.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
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

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">I want to</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('Customer')}
                className={`p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  role === 'Customer' ? 'bg-cyan-600 border-cyan-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                }`}
              >
                Book events
              </button>
              <button
                type="button"
                onClick={() => setRole('Organizer')}
                className={`p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  role === 'Organizer' ? 'bg-cyan-600 border-cyan-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                }`}
              >
                Organize events
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2.5 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-sm text-zinc-400 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
