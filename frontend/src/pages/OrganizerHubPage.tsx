import { Link } from 'react-router-dom';
import { Plus, LayoutDashboard, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useVenues } from '../hooks/useVenues';
import { useEvents } from '../hooks/useEvents';
import Footer from '../components/Footer';

function OrganizerHubPage() {
  const role = useAuthStore((state) => state.role);
  const { data: venues } = useVenues();
  const { data: events } = useEvents();

  if (role !== 'Organizer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <p className="text-zinc-400">This page is only available to organizers.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">Organizer hub</h1>
          <p className="text-zinc-400 mb-8">Manage your venues, events, and seating.</p>

          {/* Venues */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-white font-semibold">Your venues</h2>
              <Link
                to="/create-venue"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                <Plus size={14} /> New venue
              </Link>
            </div>
            {!venues || venues.length === 0 ? (
              <p className="text-zinc-500 text-sm">No venues yet — create one to get started.</p>
            ) : (
              <div className="grid gap-2">
                {venues.map((v) => (
                  <div
                    key={v.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-medium">{v.name}</p>
                      <p className="text-zinc-500 text-sm">{v.address}</p>
                    </div>
                    <Link
                      to={`/create-section?venueId=${v.id}`}
                      className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white"
                    >
                      <Users size={14} /> Add section
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-white font-semibold">Your events</h2>
              <Link
                to="/create-event"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                <Plus size={14} /> New event
              </Link>
            </div>
            {!events || events.length === 0 ? (
              <p className="text-zinc-500 text-sm">No events yet.</p>
            ) : (
              <div className="grid gap-2">
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-medium">{e.name}</p>
                      <p className="text-zinc-500 text-sm">{e.venue?.name}</p>
                    </div>
                    <Link
                      to={`/events/${e.id}/dashboard`}
                      className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OrganizerHubPage;