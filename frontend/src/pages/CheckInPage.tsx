import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, QrCode, Camera, Keyboard } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuthStore } from '../store/authStore';
import { useCheckIn } from '../hooks/useCheckIn';

interface CheckInResult {
  success: boolean;
  message: string;
}

function CheckInPage() {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const role = useAuthStore((state) => state.role);
  const checkInMutation = useCheckIn();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingScan = useRef(false);

  function processCode(rawCode: string) {
    if (isProcessingScan.current) return;
    isProcessingScan.current = true;

    checkInMutation.mutate(rawCode.trim(), {
      onSuccess: () => {
        setLastResult({ success: true, message: 'Ticket valid — entry granted.' });
        toast.success('Check-in successful');
        setCode('');
        setTimeout(() => {
          isProcessingScan.current = false;
        }, 1500);
      },
      onError: (error: unknown) => {
        const message = isAxiosError(error)
          ? error.response?.data
          : 'This ticket could not be validated.';
        setLastResult({ success: false, message: String(message) });
        toast.error('Check-in failed');
        setTimeout(() => {
          isProcessingScan.current = false;
        }, 1500);
      },
    });
  }

  useEffect(() => {
    if (mode !== 'scan' || role !== 'Organizer') return;

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => processCode(decodedText),
        () => {}
      )
      .catch(() => {
        toast.error('Could not access camera. Try manual entry instead.');
        setMode('manual');
      });

    return () => {
      scanner.stop().catch(() => {});
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, role]);

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    processCode(code);
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
        <p className="text-zinc-400 mb-6">Scan or enter a ticket code to validate entry.</p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('scan')}
            className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'scan' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Camera size={16} /> Scan
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'manual' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Keyboard size={16} /> Manual
          </button>
        </div>

        {mode === 'scan' ? (
          <div id="qr-reader" className="rounded-xl overflow-hidden mb-6 bg-zinc-900 border border-zinc-800" />
        ) : (
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste or scan the ticket code"
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
        )}

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
