interface Badge {
  label: string;
  bg: string;
  color: string;
}

interface StatusBadgesProps {
  badges: Badge[];
}

export function StatusBadges({ badges }: StatusBadgesProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {badges.map((badge, i) => (
        <span
          key={i}
          className="text-[11px] font-mono px-2 py-0.5 rounded-full"
          style={{
            background: badge.bg,
            color: badge.color,
          }}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}