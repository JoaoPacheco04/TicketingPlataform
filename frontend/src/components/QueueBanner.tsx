import { Users } from 'lucide-react';
import { useWaitingQueue } from '../hooks/useWaitingQueue';

function QueueBanner({ eventId }: { eventId: string | undefined }) {
  const { position, hasJoined, isLoading, join } = useWaitingQueue(eventId);

  if (!hasJoined) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-amber-400" />
          <p className="text-amber-300 text-sm">High demand — join the waiting queue to get a fair spot.</p>
        </div>
        <button
          onClick={join}
          className="bg-amber-600 hover:bg-amber-500 text-white text-sm px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          Join queue
        </button>
      </div>
    );
  }

  return (
    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
      <Users size={18} className="text-cyan-400" />
      <div>
        <p className="text-cyan-300 text-sm font-medium">
          {isLoading ? 'Checking your position...' : `You're #${position} in the queue`}
        </p>
        <p className="text-zinc-500 text-xs">We'll let you in as soon as it's your turn.</p>
      </div>
    </div>
  );
}

export default QueueBanner;