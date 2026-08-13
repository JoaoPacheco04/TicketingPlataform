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
  return (
    <button
      disabled={isOccupied || isPending}
      onClick={() => onReserve(seat.id)}
      title={`${seat.row}${seat.number}`}
      className={`w-9 h-9 rounded-md text-[11px] font-medium flex items-center justify-center transition-colors shrink-0 ${
        isOccupied
          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          : 'bg-emerald-600/15 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white'
      }`}
    >
      {seat.number}
    </button>
  );
}

function groupByRow(seats: Seat[]): Record<string, Seat[]> {
  return seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    (acc[seat.row] ??= []).push(seat);
    return acc;
  }, {});
}

function RowsLayout({ seats, occupiedSeatIds, isPending, onReserve }: Omit<SeatMapProps, 'layoutType'>) {
  const rows = groupByRow(seats);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full max-w-md h-1.5 bg-cyan-500/30 rounded-full mb-4" />
      {Object.entries(rows).map(([row, rowSeats]) => (
        <div key={row} className="flex items-center gap-2">
          <span className="text-zinc-500 text-xs w-4">{row}</span>
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
  const rows = Object.entries(groupByRow(seats));
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-2/3 h-1.5 bg-cyan-500/30 rounded-full mb-2" />
      <p className="text-zinc-600 text-[10px] tracking-widest uppercase mb-2">Stage</p>
      {rows.map(([row, rowSeats], rowIndex) => {
        const curveOffset = Math.abs(rowIndex - (rows.length - 1) / 2) * 10;
        return (
          <div
            key={row}
            className="flex items-center gap-1.5"
            style={{ marginLeft: curveOffset, marginRight: curveOffset }}
          >
            <span className="text-zinc-500 text-xs w-4">{row}</span>
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
  const rows = Object.entries(groupByRow(seats));
  // group rows into clusters of 2 to simulate tables
  const clusters: [string, Seat[]][][] = [];
  for (let i = 0; i < rows.length; i += 2) {
    clusters.push(rows.slice(i, i + 2));
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {clusters.map((cluster, clusterIndex) => (
        <div
          key={clusterIndex}
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

  const props = { seats, occupiedSeatIds, isPending, onReserve };

  switch (layoutType) {
    case SeatLayoutType.Curved:
      return <CurvedLayout {...props} />;
    case SeatLayoutType.Grid:
      return <GridLayout {...props} />;
    case SeatLayoutType.Rows:
    default:
      return <RowsLayout {...props} />;
  }
}

export default SeatMap;