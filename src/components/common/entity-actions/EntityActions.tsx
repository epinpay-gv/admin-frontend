import { Eye, Pencil } from "lucide-react";
import { ReactNode } from "react";

export type ActionItem = {
  icon: ReactNode;
  title: string;
  onClick: () => void;
};

type Props<T> = {
  row: T;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  extraActions?: ActionItem[];
};

export function EntityActions<T>({ row, onEdit, onView, extraActions = [] }: Props<T>) {
  const actions: ActionItem[] = [
    ...(onEdit ? [{ icon: <Pencil size={14} />, title: "Düzenle", onClick: () => onEdit(row) }] : []),
    ...extraActions,
    ...(onView ? [{ icon: <Eye size={14} />,    title: "Görüntüle", onClick: () => onView(row) }] : []),
  ];

  return (
    <div className="cursor-poine
    flex items-center justify-end gap-1.5">
      {actions.map((action) => (
        <ActionButton key={action.title} {...action} />
      ))}
    </div>
  );
}

export function ActionButton({ icon, title, onClick }: ActionItem) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center border transition-colors"
      style={{
        background: "var(--background-card)",
        borderColor: "var(--border)",
        color: "var(--text-muted)",
      }}
    >
      {icon}
    </button>
  );
}