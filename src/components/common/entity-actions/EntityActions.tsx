import { Eye, Pencil, LucideIcon } from "lucide-react";

type Props<T> = {
  row: T;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
};

type ActionButtonProps = {
  icon: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
};

function ActionButton({ icon: Icon, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
      style={{
        background: "var(--background-card)",
        borderColor: "var(--border)",
        color: "var(--text-muted)",
      }}
    >
      <Icon size={14} />
    </button>
  );
}

export function EntityActions<T>({ row, onEdit, onView }: Props<T>) {
  if (!onEdit && !onView) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      {onEdit && (
        <ActionButton
          icon={Pencil}

          onClick={(e) => { e.stopPropagation(); onEdit(row); }}
        />
      )}
      {onView && (
        <ActionButton
          icon={Eye}
          onClick={(e) => { e.stopPropagation(); onView(row); }}
        />
      )}
    </div>
  );
}