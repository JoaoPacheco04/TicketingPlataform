import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, QrCode } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCheckIn } from '../hooks/useCheckIn';

interface CheckInResult {
  success: boolean;
  message: string;
}

function CheckInPage() {
  const [code, setCode] = useState('');
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const role = useAuthStore((state) => state.role);
  const checkInMutation = useCheckIn();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    checkInMutation.mutate(code.trim(), {
      onSuccess: () => {
        setLastResult({ success: true, message: 'Ticket valid — entry granted.' });
        toast.success('Check-in successful');
        setCode('');
      },
      onError: (error: any) => {
        const message =
          error?.response?.data ?? 'This ticket could not be validated.';
        setLastResult({ success: false, message: String(message) });
        toast.error('Check-in failed');
      },
    });
  }

  if (role !== 'Organizer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <p className="text-zinc-400">This page is only available to organizers.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <QrCode className="text-cyan-500" size={24} />
          <h1 className="text-2xl font-bold text-white">Check-in</h1>
        </div>
        <p className="text-zinc-400 mb-8">Scan or enter a ticket code to validate entry.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ticket code"
            autoFocus
            className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={checkInMutation.isPending || !code.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-3 rounded-lg font-medium transition-colors"
          >
            {checkInMutation.isPending ? 'Validating...' : 'Validate ticket'}
          </button>
        </form>

        {lastResult && (
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              lastResult.success
                ? 'bg-emerald-600/10 border-emerald-600/30'
                : 'bg-red-600/10 border-red-600/30'
            }`}
          >
            {lastResult.success ? (
              <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            ) : (
              <XCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
            )}
            <p className={lastResult.success ? 'text-emerald-300' : 'text-red-300'}>
              {lastResult.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckInPage;