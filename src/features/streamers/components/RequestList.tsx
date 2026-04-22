// src/features/streamers/components/RequestList.tsx
"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useContracts, useContract } from "@/features/streamers/hooks/useContracts";
import {
  ContractWithRelations,
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
} from "@/features/streamers/types";


const CONTRACT_STATUS_COLOR: Record<CONTRACT_STATUS, { bg: string; color: string }> = {
  [CONTRACT_STATUS.PENDING_UPLOAD]: { bg: "rgba(160,160,160,0.15)", color: "#A0A0A0" },
  [CONTRACT_STATUS.UNDER_REVIEW]:   { bg: "rgba(255,180,0,0.15)",   color: "#FFB400" },
  [CONTRACT_STATUS.APPROVED]:       { bg: "rgba(0,198,162,0.15)",   color: "#00C6A2" },
  [CONTRACT_STATUS.REJECTED]:       { bg: "rgba(255,80,80,0.15)",   color: "#FF5050" },
  [CONTRACT_STATUS.EXPIRED]:        { bg: "rgba(160,160,160,0.15)", color: "#A0A0A0" },
};

function fmt(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR");
}

function ContractActionRow({
  contractId,
  onDone,
}: {
  contractId: string;
  onDone: () => void;
}) {
  const { approve, reject } = useContract(contractId);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading(true);
    try {
      // Onay için zorunlu start_date/end_date —  formdan alınabilir
      // şimdilik bugün + 1 yıl varsayılan
      const today   = new Date().toISOString().split("T")[0];
      const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      await approve({ start_date: today, end_date: nextYear });
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) return;
    setLoading(true);
    try {
      await reject({ notes: rejectNote });
      setShowReject(false);
      setRejectNote("");
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
      {error && (
        <p className="text-xs font-mono mb-2" style={{ color: "#FF5050" }}>{error}</p>
      )}

      {!showReject ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            <CheckCircle size={13} />
            {loading ? "İşleniyor..." : "Onayla"}
          </button>
          <button
            onClick={() => setShowReject(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-50"
            style={{ background: "var(--background-secondary)", borderColor: "rgba(255,80,80,0.3)", color: "#FF5050" }}
          >
            <XCircle size={13} />
            Reddet
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Red sebebini yazın... *"
            rows={2}
            className="w-full rounded-lg border px-3 py-2 text-xs outline-none resize-none"
            style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              disabled={loading || !rejectNote.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
              style={{ background: "#FF5050" }}
            >
              <XCircle size={13} />
              {loading ? "İşleniyor..." : "Reddet"}
            </button>
            <button
              onClick={() => { setShowReject(false); setRejectNote(""); }}
              className="px-3 py-1.5 rounded-lg text-xs border"
              style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function ContractCard({
  contract,
  onRefresh,
}: {
  contract: ContractWithRelations;
  onRefresh: () => void;
}) {
  const sc        = CONTRACT_STATUS_COLOR[contract.status];
  const isReviewable =
    contract.status === CONTRACT_STATUS.PENDING_UPLOAD ||
    contract.status === CONTRACT_STATUS.UNDER_REVIEW;

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "var(--background-secondary)", borderColor: "var(--border)" }}
    >
      {/* Üst satır */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Paket adı */}
          {contract.package?.name && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(0,133,255,0.15)", color: "#0085FF" }}
            >
              {contract.package.name}
            </span>
          )}
          {/* Durum */}
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ background: sc.bg, color: sc.color }}
          >
            {CONTRACT_STATUS_LABELS[contract.status]}
          </span>
        </div>
        <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          {fmt(contract.createdAt)}
        </span>
      </div>

      {/* Tarih aralığı */}
      {(contract.startDate || contract.endDate) && (
        <p className="text-xs font-mono mt-2" style={{ color: "var(--text-secondary)" }}>
          {fmt(contract.startDate)}
          <span style={{ color: "var(--text-muted)" }}> → </span>
          {fmt(contract.endDate)}
        </p>
      )}

      {/* Notlar */}
      {contract.notes && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Not: {contract.notes}
        </p>
      )}

      {/* Belge linki */}
      {contract.uploadedDocumentUrl && (
        <a
          href={contract.uploadedDocumentUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono mt-1 underline block"
          style={{ color: "#0085FF" }}
        >
          Belgeyi Görüntüle
        </a>
      )}

      {/* Onay/Red — sadece incelenebilir durumdaysa */}
      {isReviewable && (
        <ContractActionRow contractId={contract.id} onDone={onRefresh} />
      )}
    </div>
  );
}


interface RequestListProps {
  streamerId: string; // UUID
}

export default function RequestList({ streamerId }: RequestListProps) {
  const { contracts, loading, error, refresh } = useContracts();

  // Sadece bu yayıncıya ait sözleşmeleri filtrele
  const streamerContracts = contracts.filter((c) => c.streamerId === streamerId);

  if (loading) {
    return (
      <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
        Yükleniyor...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm font-mono" style={{ color: "#FF5050" }}>
        {error}
      </p>
    );
  }

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Sözleşmeler · {streamerContracts.length} kayıt
      </p>

      {streamerContracts.length === 0 ? (
        <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
          Bu yayıncıya ait sözleşme bulunmuyor.
        </p>
      ) : (
        <div className="space-y-3">
          {streamerContracts.map((c) => (
            <ContractCard key={c.id} contract={c} onRefresh={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}