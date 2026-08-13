import { Link, useParams } from 'react-router-dom';
import { useSections } from '../hooks/useSections';
import { useReservations } from '../hooks/useReservations';
import { useCreateReservation } from '../hooks/useCreateReservation';
import { useAuthStore } from '../store/authStore';
import { useSeatReservationHub } from '../hooks/useSeatReservationHub';
import SeatMap from '../components/SeatMap';
import Footer from '../components/Footer';
import QueueBanner from '../components/QueueBanner';
import { toast } from 'sonner';

function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  useSeatReservationHub(eventId);
  const { data: sections, isLoading, isError } = useSections();
  const { data: reservations } = useReservations();
  const createReservation = useCreateReservation();

  function handleReserve(seatId: string) {
    if (!eventId) return;

    createReservation.mutate(
      { seatId, eventId },
      {
        onSuccess: () => {
          toast.success('Seat reserved! You have 10 minutes to confirm.');
        },
        onError: () => {
          toast.error('Could not reserve this seat. It may already be taken.');
        },
      }
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 gap-4 px-6">
        <p className="text-white text-lg text-center">You need to log in to view available seats.</p>
        <Link
          to="/login"
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-zinc-900 rounded animate-pulse mb-6" />
        <div className="h-40 bg-zinc-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-400 p-6">Failed to load seats.</p>;
  }

  const occupiedSeatIds = new Set(
    (reservations ?? [])
      .filter((r) => r.eventId === eventId && (r.status === 0 || r.status === 1))
      .map((r) => r.seatId)
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-2xl font-bold text-white">Select a seat</h1>
            {role === 'Organizer' && (
              <Link
                to={`/events/${eventId}/dashboard`}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                View dashboard →
              </Link>
            )}
          </div>
          <p className="text-zinc-400 mb-6">Pick an available seat to start your reservation.</p>

          <QueueBanner eventId={eventId} />

          <div className="flex gap-4 mb-6 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" /> Taken
            </span>
          </div>

          <div className="grid gap-6">
            {sections?.map((section) => (
              <div key={section.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex justify-between items-baseline mb-4">
                  <h2 className="text-lg font-semibold text-white">{section.name}</h2>
                  <span className="text-cyan-400 font-medium">€{section.basePrice.toFixed(2)}</span>
                </div>
                <SeatMap
                  seats={section.seats}
                  layoutType={section.layoutType}
                  occupiedSeatIds={occupiedSeatIds}
                  isPending={createReservation.isPending}
                  onReserve={handleReserve}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EventDetailPage;