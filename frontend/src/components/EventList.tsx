import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, CalendarX } from "lucide-react";
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
  const [search, setSearch] = useState("");

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

  const filtered = (events ?? []).filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.venue?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events or venues..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarX className="text-zinc-600 mb-3" size={40} />
          <p className="text-zinc-400">
            {search ? `No events matching "${search}"` : "No events available right now."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((event) => {
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
                      {new Date(event.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
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
      )}
    </div>
  );
}

export default EventList;