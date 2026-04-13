"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "mega";
}

const SIZE_STYLES = {
  sm: "!max-w-sm",
  md: "!max-w-md",
  lg: "!max-w-lg",
  xl: "!max-w-2xl",
  mega: "!max-w-4xl"
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className={`w-full ${SIZE_STYLES[size]} border p-0 gap-0 shadow-2xl`}
        style={{
          background: "var(--background-secondary)",
          borderColor: "var(--border)",
        }}
      >
        {/* Header */}
        {(title || description) && (
          <DialogHeader
            className="px-6 pt-6 pb-4 border-b"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            {title && (
              <DialogTitle
                className="text-base font-semibold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Content */}
        <div className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <DialogFooter
            className="px-6 py-4 border-t"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}