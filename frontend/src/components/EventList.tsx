import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useEvents } from "../hooks/useEvents";

const statusLabels: Record<number, { label: string; color: string }> = {
  0: { label: "Draft", color: "bg-zinc-700 text-zinc-300" },
  1: { label: "On sale", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  2: { label: "Sold out", color: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
  3: { label: "Cancelled", color: "bg-red-500/15 text-red-400 border border-red-500/30" },
};

function EventList() {
  const { data: events, isLoading, isError } = useEvents();

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-zinc-900 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-400">Failed to load events.</p>;
  }

  if (!events || events.length === 0) {
    return <p className="text-zinc-400">No events available right now.</p>;
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => {
        const status = statusLabels[event.status] ?? statusLabels[0];
        return (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group flex overflow-hidden bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-colors"
          >
            <div className="w-1 bg-cyan-500" />
            <div className="flex-1 p-5 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {event.name}
                  </h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm">{event.description}</p>
                {event.venue && (
                  <p className="text-zinc-500 text-xs mt-2 flex items-center gap-1">
                    <MapPin size={12} className="text-zinc-500" />
                    {event.venue.name}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0 pl-4">
                <p className="text-white font-medium">
                  {new Date(event.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
                <p className="text-zinc-500 text-sm">
                  {new Date(event.startDate).toLocaleDateString("en-GB", { year: "numeric" })}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default EventList;