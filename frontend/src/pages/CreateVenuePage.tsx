import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useCreateVenue } from '../hooks/useCreateVenue';

function CreateVenuePage() {
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();
  const createVenue = useCreateVenue();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createVenue.mutate(
      { name, address },
      {
        onSuccess: () => {
          toast.success('Venue created!');
          navigate('/organizer');
        },
        onError: () => toast.error('Could not create venue.'),
      }
    );
  }

  if (role !== 'Organizer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <p className="text-zinc-400">This page is only available to organizers.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Create venue</h1>
        <p className="text-zinc-400 mb-8">Add a new location to host your events.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Venue name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Casa da Música"
              required
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. da Boavista, Porto"
              required
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={createVenue.isPending}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2.5 rounded-lg font-medium transition-colors mt-2"
          >
            {createVenue.isPending ? 'Creating...' : 'Create venue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateVenuePage;