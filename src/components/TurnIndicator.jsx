import PlayerChip from './PlayerChip.jsx';

export default function TurnIndicator({ players, currentIndex }) {
  const active = players.filter(p => !p.isEliminated);

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex gap-4 px-1 min-w-max">
        {active.map((player, i) => (
          <PlayerChip
            key={player.id}
            player={player}
            isActive={i === currentIndex}
            isEliminated={false}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
