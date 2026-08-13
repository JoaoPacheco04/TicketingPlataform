import { useParams } from 'react-router-dom';
import { TrendingUp, Users, Euro, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useEventDashboard } from '../hooks/useEventDashboard';

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:-translate-y-0.5 transition-all">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
        {icon}
      </div>
      <p className="text-zinc-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const role = useAuthStore((state) => state.role);
  const { data, isLoading, isError } = useEventDashboard(eventId);

  if (role !== 'Organizer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <p className="text-zinc-400">This page is only available to organizers.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 max-w-4xl mx-auto">
        <div className="h-8 w-64 bg-zinc-900 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-red-400 p-6">Failed to load dashboard.</p>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">{data.eventName}</h1>
        <p className="text-zinc-400 mb-8">Live sales overview</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<TrendingUp size={18} className="text-cyan-400" />}
            label="Occupancy"
            value={`${data.occupancyRate}%`}
            accent="bg-cyan-500/10"
          />
          <StatCard
            icon={<Users size={18} className="text-emerald-400" />}
            label="Seats sold"
            value={`${data.occupiedSeats} / ${data.totalSeats}`}
            accent="bg-emerald-500/10"
          />
          <StatCard
            icon={<Euro size={18} className="text-amber-400" />}
            label="Revenue"
            value={`€${data.revenue.toFixed(2)}`}
            accent="bg-amber-500/10"
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-violet-400" />}
            label="Checked in"
            value={`${data.checkedInCount}`}
            accent="bg-violet-500/10"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Reservations by status</h2>
          <div className="space-y-3">
            {[
              { label: 'Confirmed', value: data.reservationsByStatus.confirmed, color: 'bg-emerald-500' },
              { label: 'Pending', value: data.reservationsByStatus.pending, color: 'bg-amber-500' },
              { label: 'Expired', value: data.reservationsByStatus.expired, color: 'bg-zinc-600' },
              { label: 'Cancelled', value: data.reservationsByStatus.cancelled, color: 'bg-red-500' },
            ].map((row) => {
              const total =
                data.reservationsByStatus.confirmed +
                data.reservationsByStatus.pending +
                data.reservationsByStatus.expired +
                data.reservationsByStatus.cancelled;
              const percentage = total > 0 ? (row.value / total) * 100 : 0;
              return (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-300">{row.label}</span>
                    <span className="text-zinc-400">{row.value}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.color} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;