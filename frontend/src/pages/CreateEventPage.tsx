import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useVenues } from '../hooks/useVenues';
import { useCreateEvent } from '../hooks/useCreateEvent';

function CreateEventPage() {
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();
  const { data: venues, isLoading: isLoadingVenues } = useVenues();
  const createEventMutation = useCreateEvent();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [venueId, setVenueId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [salesOpenDate, setSalesOpenDate] = useState('');
  const [salesCloseDate, setSalesCloseDate] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const eventDate = new Date(startDate);
    const openDate = new Date(salesOpenDate);
    const closeDate = new Date(salesCloseDate);

    if (openDate >= closeDate) {
      toast.error('Sales open date must be before sales close date.');
      return;
    }

    if (closeDate > eventDate) {
      toast.error('Sales must close before the event starts.');
      return;
    }

    createEventMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        venueId,
        startDate: eventDate.toISOString(),
        salesOpenDate: openDate.toISOString(),
        salesCloseDate: closeDate.toISOString(),
      },
      {
        onSuccess: () => {
          toast.success('Event created!');
          navigate('/organizer');
        },
        onError: () => toast.error('Could not create event.'),
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
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Create event</h1>
        <p className="text-zinc-400 mb-8">Set up a new event for people to book.</p>

        {!isLoadingVenues && (!venues || venues.length === 0) ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-white font-medium mb-1">Create a venue first</p>
            <p className="text-zinc-400 text-sm mb-4">Events need a venue before tickets can be sold.</p>
            <Link
              to="/create-venue"
              className="inline-flex bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create venue
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Event name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/event-cover.jpg"
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Venue</label>
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                required
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select a venue...</option>
                {venues?.map((venue) => (
                  <option key={venue.id} value={venue.id}>{venue.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Event date & time</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm text-zinc-300">Sales open</label>
                <input
                  type="datetime-local"
                  value={salesOpenDate}
                  onChange={(e) => setSalesOpenDate(e.target.value)}
                  required
                  className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm text-zinc-300">Sales close</label>
                <input
                  type="datetime-local"
                  value={salesCloseDate}
                  onChange={(e) => setSalesCloseDate(e.target.value)}
                  required
                  className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={createEventMutation.isPending || !name.trim() || !description.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2.5 rounded-lg font-medium transition-colors mt-2"
            >
              {createEventMutation.isPending ? 'Creating...' : 'Create event'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateEventPage;
