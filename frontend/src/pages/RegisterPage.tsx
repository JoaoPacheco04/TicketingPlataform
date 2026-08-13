import { useState } from 'react';
import { register } from '../api/auth';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Customer' | 'Organizer'>('Customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register({ fullName, email, password, role });
      setSuccess(true);
    } catch {
      setError('Registration failed. Please check your details.');
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-lg">Account created! You can now log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg shadow w-80 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-white">Register</h1>

        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'Customer' | 'Organizer')}
          className="p-2 rounded bg-slate-700 text-white"
        >
          <option value="Customer">Customer</option>
          <option value="Organizer">Organizer</option>
        </select>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Create account
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;