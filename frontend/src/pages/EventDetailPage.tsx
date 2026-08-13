import { useParams } from 'react-router-dom';
import { useSections } from '../hooks/useSections';
import { useCreateReservation } from '../hooks/useCreateReservation';
import { useAuthStore } from '../store/authStore';

function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: sections, isLoading, isError } = useSections();
  const createReservation = useCreateReservation();
  const token = useAuthStore((state) => state.token);

  function handleReserve(seatId: string) {
    if (!eventId) return;

    createReservation.mutate(
      { seatId, eventId },
      {
        onError: () => {
          alert('Could not reserve this seat. It may already be taken.');
        },
      }
    );
  }

  if (isLoading) return <p className="text-white p-6">Loading seats...</p>;
  if (isError) return <p className="text-red-400 p-6">Failed to load seats.</p>;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Select a seat</h1>

      {!token && (
        <p className="text-yellow-400 mb-4">You must be logged in to reserve a seat.</p>
      )}

      <div className="grid gap-6">
        {sections?.map((section) => (
          <div key={section.id} className="bg-slate-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-2">
              {section.name} — €{section.basePrice.toFixed(2)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {section.seats.map((seat) => (
                <button
                  key={seat.id}
                  disabled={!token || createReservation.isPending}
                  onClick={() => handleReserve(seat.id)}
                  className="bg-slate-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded"
                >
                  {seat.row}{seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventDetailPage;