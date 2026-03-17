interface SpinnerProps {
  size?: number;
}

export default function Spinner({ size = 6 }: SpinnerProps) {
  return (
    <div
      className={`w-${size} h-${size} border-2 rounded-full animate-spin`}
      style={{
        borderTopColor: "var(--border)",
        borderRightColor: "var(--border)",
        borderBottomColor: "var(--border)",
        borderLeftColor: "#00C6A2",
      }}
    />
  );
}