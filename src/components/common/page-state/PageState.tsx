import React from 'react';
import Spinner from "@/components/common/spinner/Spinner"; 
import { Button } from "@/components/ui/button";

interface PageStateProps {
  loading: boolean;
  error: string | null | undefined;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const PageState = ({
  loading,
  error,
  onRetry,
  children,
  className = "h-64"
}: PageStateProps) => {
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <p className="text-red-400 text-sm font-mono">{error}</p>
        <Button
          variant="ghost"
          onClick={onRetry || (() => window.location.reload())}
          style={{ color: "var(--text-muted)" }}
        >
          Tekrar dene
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};