import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { QrCode, Clock, History } from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import { fetchReservationQrCode } from '../api/reservation';
import { useAuthStore } from '../store/authStore';
import Footer from '../components/Footer';

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  1: { label: 'Confirmed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  2: { label: 'Expired', color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30' },
  3: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
};

function MyReservationsPage() {
  const { data: reservations, isLoading } = useReservations();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const userId = useAuthStore((state) => state.userId);

  const allMyReservations = (reservations ?? []).filter((r) => r.userId === userId);
  const activeReservations = allMyReservations.filter((r) => r.status === 0 || r.status === 1);
  const pastReservations = allMyReservations.filter((r) => r.status === 2 || r.status === 3);

  const visibleReservations = showHistory ? allMyReservations : activeReservations;

  async function handleShowQrCode(reservationId: string) {
    try {
      const url = await fetchReservationQrCode(reservationId);
      setQrCodeUrl(url);
    } catch {
      toast.error('Could not load QR code');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 max-w-2xl mx-auto">
        <div className="h-8 w-56 bg-zinc-900 rounded animate-pulse mb-6" />
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-zinc-900 rounded-xl animate-pulse mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-2xl font-bold text-white">My reservations</h1>
            {pastReservations.length > 0 && (
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm"
              >
                <History size={14} />
                {showHistory ? 'Hide history' : `Show history (${pastReservations.length})`}
              </button>
            )}
          </div>
          <p className="text-zinc-400 mb-8">Manage and confirm your upcoming bookings.</p>

          {visibleReservations.length === 0 ? (
            <p className="text-zinc-500">
              {showHistory ? 'No reservations found.' : "You don't have any active reservations."}
            </p>
          ) : (
            <div className="grid gap-4">
              {visibleReservations.map((r) => {
                const status = statusMap[r.status] ?? statusMap[0];
                const isPast = r.status === 2 || r.status === 3;
                return (
                  <div
                    key={r.id}
                    className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center ${
                      isPast ? 'opacity-60' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium">
                          Seat {r.seat?.row}{r.seat?.number}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      {r.status === 0 && (
                        <p className="text-zinc-500 text-xs flex items-center gap-1">
                          <Clock size={12} /> Expires {new Date(r.expiresAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {r.status === 0 && (
                        <Link
                          to={`/checkout/${r.id}`}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                          Pay now
                        </Link>
                      )}
                      {r.status === 1 && (
                        <button
                          onClick={() => handleShowQrCode(r.id)}
                          className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                          <QrCode size={16} /> View ticket
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {qrCodeUrl && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-20"
              onClick={() => setQrCodeUrl(null)}
            >
              <div
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-white font-medium">Your ticket</p>
                <img src={qrCodeUrl} alt="QR code" className="rounded-lg bg-white p-3" />
                <button
                  onClick={() => setQrCodeUrl(null)}
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MyReservationsPage;