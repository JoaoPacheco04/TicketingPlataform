import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CreditCard, Lock } from 'lucide-react';
import { useConfirmReservation } from '../hooks/useConfirmReservation';
import { useReservations } from '../hooks/useReservations';

function CheckoutPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const confirmMutation = useConfirmReservation();
  const { data: reservations } = useReservations();
  const reservation = reservations?.find((r) => r.id === reservationId);

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reservationId) return;

    setIsProcessing(true);
    // Simulate payment processing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1200));

    confirmMutation.mutate(reservationId, {
      onSuccess: () => {
        toast.success('Payment successful! Your ticket is confirmed.');
        navigate('/my-reservations');
      },
      onError: () => {
        toast.error('Payment failed — reservation may have expired.');
        setIsProcessing(false);
      },
    });
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <p className="text-zinc-400">Reservation not found.</p>
      </div>
    );
  }

  if (reservation.status !== 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-6 gap-4">
        <p className="text-zinc-400">This reservation is no longer pending payment.</p>
        <Link to="/my-reservations" className="text-cyan-400 hover:text-cyan-300 text-sm">
          Go to my reservations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="text-cyan-500" size={22} />
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
        </div>
        <p className="text-zinc-400 mb-6">Complete your payment to confirm the reservation.</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-white font-medium">
              Seat {reservation.seat?.row}{reservation.seat?.number}
            </p>
            <p className="text-zinc-500 text-xs">Reservation expires soon — complete payment now</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Cardholder name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Jane Doe"
              required
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Card number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              required
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-zinc-300">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                required
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex flex-col gap-1 w-24">
              <label className="text-sm text-zinc-300">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                required
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-3 rounded-lg font-medium transition-colors mt-2"
          >
            {isProcessing ? 'Processing payment...' : 'Pay & confirm'}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs">
            <Lock size={12} /> This is a simulated payment — no real card is charged.
          </p>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;