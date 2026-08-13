import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Rows3, CircleDot, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCreateSection } from '../hooks/useCreateSection';
import { SeatLayoutType } from '../types/seat';
import { useCreateSeatsBulk } from '../hooks/useCreateSeatsBulk';
import { useVenues } from '../hooks/useVenues';

const layoutOptions = [
  {
    value: SeatLayoutType.Rows,
    label: 'Straight rows',
    description: 'Classic cinema-style rows',
    icon: Rows3,
  },
  {
    value: SeatLayoutType.Curved,
    label: 'Curved rows',
    description: 'Auditorium-style, facing a stage',
    icon: CircleDot,
  },
  {
    value: SeatLayoutType.Grid,
    label: 'Table clusters',
    description: 'Grouped blocks, like a gala dinner',
    icon: LayoutGrid,
  },
];

function CreateSectionPage() {
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: venues } = useVenues();
  const createSectionMutation = useCreateSection();
  const createSeatsBulkMutation = useCreateSeatsBulk();

  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [layoutType, setLayoutType] = useState<SeatLayoutType>(SeatLayoutType.Rows);
  const [venueId, setVenueId] = useState(searchParams.get('venueId') ?? '');
  const [rowCount, setRowCount] = useState('5');
  const [seatsPerRow, setSeatsPerRow] = useState('10');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createSectionMutation.mutate(
      { name, basePrice: parseFloat(basePrice), venueId, layoutType },
      {
        onSuccess: (newSection) => {
          createSeatsBulkMutation.mutate(
            {
              sectionId: newSection.id,
              rowCount: parseInt(rowCount),
              seatsPerRow: parseInt(seatsPerRow),
            },
            {
              onSuccess: () => {
                toast.success(`Section created with ${parseInt(rowCount) * parseInt(seatsPerRow)} seats!`);
                navigate('/organizer');
              },
              onError: () => toast.error('Section created, but seats could not be generated.'),
            }
          );
        },
        onError: () => toast.error('Could not create section.'),
      }
    );
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
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Create section</h1>
        <p className="text-zinc-400 mb-8">Define a seating area and how it should be laid out.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Section name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VIP, Floor, Balcony..."
              required
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Venue</label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              required
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select a venue...</option>
              {venues?.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-300">Base price (€)</label>
            <input
              type="number"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="75.00"
              required
              className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-zinc-300">Number of rows</label>
              <input
                type="number"
                min="1"
                value={rowCount}
                onChange={(e) => setRowCount(e.target.value)}
                required
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-zinc-300">Seats per row</label>
              <input
                type="number"
                min="1"
                value={seatsPerRow}
                onChange={(e) => setSeatsPerRow(e.target.value)}
                required
                className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-300">Seating layout</label>
            <div className="grid gap-2">
              {layoutOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = layoutType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLayoutType(option.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'bg-cyan-600/10 border-cyan-500'
                        : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    <Icon size={20} className={isSelected ? 'text-cyan-400' : 'text-zinc-400'} />
                    <div>
                      <p className="text-white text-sm font-medium">{option.label}</p>
                      <p className="text-zinc-500 text-xs">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={createSectionMutation.isPending}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2.5 rounded-lg font-medium transition-colors mt-2"
          >
            {createSectionMutation.isPending ? 'Creating...' : 'Create section'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateSectionPage;