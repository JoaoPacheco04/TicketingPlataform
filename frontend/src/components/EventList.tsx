import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

function EventList() {
  const { data: events, isLoading, isError } = useEvents();

  if (isLoading) {
    return <p className="text-white">Loading events...</p>;
  }

  if (isError) {
    return <p className="text-red-400">Failed to load events.</p>;
  }

  return (
    <div className="grid gap-4 p-6">
      {events?.map((event) => (
        <Link
          key={event.id}
          to={`/events/${event.id}`}
          className="block bg-slate-800 rounded-lg p-4 text-white shadow hover:bg-slate-700"
        >
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p className="text-slate-400">{event.description}</p>
          <p className="text-sm text-slate-500 mt-2">
            {new Date(event.startDate).toLocaleDateString("en-GB")}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default EventList;