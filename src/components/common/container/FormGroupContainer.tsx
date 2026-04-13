interface FormGroupContainerProps {
  title: string;
  titleLength?: number;
  maxTitleLength?: number;
  formArea: React.ReactNode;
}

export default function FormGroupContainer({
  title,
  titleLength,
  maxTitleLength,
  formArea,
}: FormGroupContainerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* TITLE */}
      <div className="flex items-center justify-between">
        <label
          className="text-base font-semibold tracking-widest font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          {title}
        </label>
        {titleLength && maxTitleLength && (
          <span
            className="text-base font-mono"
            style={{
              color:
                titleLength > maxTitleLength ? "#FF5050" : "var(--text-muted)",
            }}
          >
            {titleLength}/{maxTitleLength}
          </span>
        )}
      </div>

      {/* INPUT */}
      {formArea}
    </div>
  );
}
