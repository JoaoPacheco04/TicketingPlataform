import { SeatLayoutType } from '../types/seat';
import type { Seat } from '../types/seat';

interface SeatMapProps {
  seats: Seat[];
  layoutType: SeatLayoutType;
  occupiedSeatIds: Set<string>;
  isPending: boolean;
  onReserve: (seatId: string) => void;
}

function SeatButton({
  seat,
  isOccupied,
  isPending,
  onReserve,
}: {
  seat: Seat;
  isOccupied: boolean;
  isPending: boolean;
  onReserve: (seatId: string) => void;
}) {
  const seatLabel = `${seat.row}${seat.number}`;

  return (
    <button
      disabled={isOccupied || isPending}
      onClick={() => onReserve(seat.id)}
      title={seatLabel}
      aria-label={`${isOccupied ? 'Taken' : 'Available'} seat ${seatLabel}`}
      className={`w-9 h-9 rounded-md text-[11px] font-medium flex items-center justify-center transition-all active:scale-90 shrink-0 ${
        isOccupied
          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          : 'bg-emerald-600/15 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400'
      }`}
    >
      {seat.number}
    </button>
  );
}

function compareRows([rowA]: [string, Seat[]], [rowB]: [string, Seat[]]) {
  return rowA.localeCompare(rowB, undefined, { numeric: true, sensitivity: 'base' });
}

function sortSeats(seats: Seat[]) {
  return [...seats].sort((a, b) =>
    a.number.localeCompare(b.number, undefined, { numeric: true, sensitivity: 'base' })
  );
}

function groupByRow(seats: Seat[]): [string, Seat[]][] {
  const rows = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    (acc[seat.row] ??= []).push(seat);
    return acc;
  }, {});

  return Object.entries(rows)
    .sort(compareRows)
    .map(([row, rowSeats]) => [row, sortSeats(rowSeats)]);
}

function RowsLayout({ seats, occupiedSeatIds, isPending, onReserve }: Omit<SeatMapProps, 'layoutType'>) {
  const rows = groupByRow(seats);
  return (
    <div className="flex flex-col items-center gap-2 min-w-max">
      <div className="w-full max-w-md h-1.5 bg-cyan-500/30 rounded-full mb-1" />
      <p className="text-zinc-600 text-[10px] tracking-widest uppercase mb-3">Stage</p>
      {rows.map(([row, rowSeats]) => (
        <div key={row} className="flex items-center gap-2">
          <span className="text-zinc-500 text-xs w-5 text-right">{row}</span>
          <div className="flex gap-1.5">
            {rowSeats.map((seat) => (
              <SeatButton
                key={seat.id}
                seat={seat}
                isOccupied={occupiedSeatIds.has(seat.id)}
                isPending={isPending}
                onReserve={onReserve}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CurvedLayout({ seats, occupiedSeatIds, isPending, onReserve }: Omit<SeatMapProps, 'layoutType'>) {
  const rows = groupByRow(seats);
  return (
    <div className="flex flex-col items-center gap-3 min-w-max">
      <div className="w-2/3 h-1.5 bg-cyan-500/30 rounded-full mb-2" />
      <p className="text-zinc-600 text-[10px] tracking-widest uppercase mb-2">Stage</p>
      {rows.map(([row, rowSeats], rowIndex) => {
        const curveOffset = Math.abs(rowIndex - (rows.length - 1) / 2) * 24;
        return (
          <div
            key={row}
            className="flex items-center gap-1.5"
            style={{ marginLeft: curveOffset, marginRight: curveOffset }}
          >
            <span className="text-zinc-500 text-xs w-5 text-right">{row}</span>
            {rowSeats.map((seat) => (
              <SeatButton
                key={seat.id}
                seat={seat}
                isOccupied={occupiedSeatIds.has(seat.id)}
                isPending={isPending}
                onReserve={onReserve}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function GridLayout({ seats, occupiedSeatIds, isPending, onReserve }: Omit<SeatMapProps, 'layoutType'>) {
  const rows = groupByRow(seats);
  const clusters: [string, Seat[]][][] = [];
  for (let i = 0; i < rows.length; i += 2) {
    clusters.push(rows.slice(i, i + 2));
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-max sm:min-w-0">
      {clusters.map((cluster, clusterIndex) => (
        <div
          key={cluster.map(([row]) => row).join('-')}
          className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 flex flex-col gap-2 items-center"
        >
          <p className="text-zinc-500 text-[10px] uppercase tracking-wide">Table {clusterIndex + 1}</p>
          {cluster.map(([row, rowSeats]) => (
            <div key={row} className="flex gap-1.5">
              {rowSeats.map((seat) => (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  isOccupied={occupiedSeatIds.has(seat.id)}
                  isPending={isPending}
                  onReserve={onReserve}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SeatMap({ seats, layoutType, occupiedSeatIds, isPending, onReserve }: SeatMapProps) {
  if (seats.length === 0) {
    return <p className="text-zinc-500 text-sm text-center py-6">No seats configured for this section.</p>;
  }

  const availableSeats = seats.filter((seat) => !occupiedSeatIds.has(seat.id)).length;
  const props = { seats, occupiedSeatIds, isPending, onReserve };

  return (
    <div>
      <p className="text-zinc-500 text-xs mb-3">
        {availableSeats} of {seats.length} seats available
      </p>
      <div className="overflow-x-auto pb-2">
        {layoutType === SeatLayoutType.Curved && <CurvedLayout {...props} />}
        {layoutType === SeatLayoutType.Grid && <GridLayout {...props} />}
        {layoutType !== SeatLayoutType.Curved && layoutType !== SeatLayoutType.Grid && <RowsLayout {...props} />}
      </div>
    </div>
  );
}

export default SeatMap;
