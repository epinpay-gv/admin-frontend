interface FormSectionContainerProps {
  title?: string;
  content: React.ReactNode;
}

export default function FormSectionContainer({
  title,
  content,
}: FormSectionContainerProps) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{
        background: "var(--background-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* TITLE */}
      {title && (
        <div className="flex items-center gap-3">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--border)" }}
          />
          <span
            className="text-[12px] font-semibold uppercase tracking-widest font-mono whitespace-nowrap"
            style={{ color: "var(--text-heading)" }}
          >
            {title}
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--border)" }}
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="mt-4">{content}</div>
    </div>
  );
}
