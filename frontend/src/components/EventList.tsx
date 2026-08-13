import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarX, MapPin, Search, X } from "lucide-react";
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
  const [statusFilter, setStatusFilter] = useState<"all" | "on-sale">("all");

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

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = (events ?? [])
    .filter((event) => statusFilter === "all" || event.status === 1)
    .filter((event) => {
      if (!normalizedSearch) return true;
      return (
        event.name.toLowerCase().includes(normalizedSearch) ||
        event.description.toLowerCase().includes(normalizedSearch) ||
        event.venue?.name.toLowerCase().includes(normalizedSearch)
      );
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, descriptions, or venues..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-1 text-sm">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === "all" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("on-sale")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === "on-sale" ? "bg-cyan-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            On sale
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarX className="text-zinc-600 mb-3" size={40} />
          <p className="text-zinc-400">
            {search || statusFilter !== "all"
              ? "No events match your filters."
              : "No events available right now."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <p className="text-zinc-500 text-sm">
            Showing {filtered.length} {filtered.length === 1 ? "event" : "events"}
          </p>
          {filtered.map((event) => {
            const status = statusLabels[event.status] ?? statusLabels[0];
            return (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group flex flex-col overflow-hidden bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-colors sm:flex-row"
              >
                <div className="w-1 bg-cyan-500" />
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="h-40 w-full object-cover sm:h-auto sm:w-44"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 p-5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
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
                  <div className="shrink-0 sm:text-right">
                    <p className="text-white font-medium whitespace-nowrap">
                      {new Date(event.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </p>
                    <p className="text-zinc-500 text-sm">
                      {new Date(event.startDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
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
