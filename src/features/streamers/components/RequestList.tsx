// src/features/streamers/components/RequestList.tsx

"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { usePackageRequests } from "@/features/streamers/hooks/usePackageRequests";
import { usePackageRequest }  from "@/features/streamers/hooks/usePackageRequest";
import {
  PackageRequest,
  PACKAGE_REQUEST_STATUS,
  PACKAGE_REQUEST_STATUS_LABELS,
  PACKAGE_REQUEST_TYPE,
  PACKAGE_REQUEST_TYPE_LABELS,
} from "@/features/streamers/types";

const REQUEST_STATUS_COLOR: Record<PACKAGE_REQUEST_STATUS, { bg: string; color: string }> = {
  [PACKAGE_REQUEST_STATUS.PENDING]:  { bg: "rgba(255,180,0,0.15)",   color: "#FFB400" },
  [PACKAGE_REQUEST_STATUS.APPROVED]: { bg: "rgba(0,198,162,0.15)",   color: "#00C6A2" },
  [PACKAGE_REQUEST_STATUS.REJECTED]: { bg: "rgba(255,80,80,0.15)",   color: "#FF5050" },
};

const REQUEST_TYPE_COLOR: Record<PACKAGE_REQUEST_TYPE, { bg: string; color: string }> = {
  [PACKAGE_REQUEST_TYPE.RENEWAL]: { bg: "rgba(0,133,255,0.15)",  color: "#0085FF" },
  [PACKAGE_REQUEST_TYPE.UPGRADE]: { bg: "rgba(160,80,255,0.15)", color: "#A050FF" },
};

function fmt(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR");
}

function RequestActionRow({ requestId, onDone }: { requestId: number; onDone: () => void }) {
  const { approve, reject, actionLoading, actionError } = usePackageRequest(requestId);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);

  const handleApprove = async () => {
    await approve();
    onDone();
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) return;
    await reject(rejectNote);
    setShowReject(false);
    setRejectNote("");
    onDone();
  };

  return (
    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
      {actionError && (
        <p className="text-xs font-mono mb-2" style={{ color: "#FF5050" }}>{actionError}</p>
      )}

      {!showReject ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            <CheckCircle size={13} />
            {actionLoading ? "İşleniyor..." : "Onayla"}
          </button>
          <button
            onClick={() => setShowReject(true)}
            disabled={actionLoading}
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
              disabled={actionLoading || !rejectNote.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
              style={{ background: "#FF5050" }}
            >
              <XCircle size={13} />
              {actionLoading ? "İşleniyor..." : "Reddet"}
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

function RequestCard({ request, onRefresh }: { request: PackageRequest; onRefresh: () => void }) {
  const sc = REQUEST_STATUS_COLOR[request.status];
  const tc = REQUEST_TYPE_COLOR[request.requestType];
  const isPending = request.status === PACKAGE_REQUEST_STATUS.PENDING;

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "var(--background-secondary)", borderColor: "var(--border)" }}
    >
      {/* Üst satır */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ background: tc.bg, color: tc.color }}
          >
            {PACKAGE_REQUEST_TYPE_LABELS[request.requestType]}
          </span>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ background: sc.bg, color: sc.color }}
          >
            {PACKAGE_REQUEST_STATUS_LABELS[request.status]}
          </span>
        </div>
        <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          {fmt(request.createdAt)}
        </span>
      </div>

      {/* Paket geçişi */}
      <p className="text-xs font-mono mt-2" style={{ color: "var(--text-secondary)" }}>
        {request.currentPackageName}
        <span style={{ color: "var(--text-muted)" }}> → </span>
        {request.requestedPackageName}
      </p>

      {/* Yayıncı notu */}
      {request.publisherNote && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Not: {request.publisherNote}
        </p>
      )}

      {/* Admin notu — işlem yapılmışsa */}
      {request.adminNote && (
        <p
          className="text-xs mt-1 font-mono"
          style={{ color: request.status === PACKAGE_REQUEST_STATUS.REJECTED ? "#FF5050" : "#00C6A2" }}
        >
          Admin: {request.adminNote}
        </p>
      )}

      {/* Onay/Red — sadece beklemedeyse */}
      {isPending && (
        <RequestActionRow requestId={request.id} onDone={onRefresh} />
      )}
    </div>
  );
}



interface RequestListProps {
  publisherId: number;
}

export default function RequestList({ publisherId }: RequestListProps) {
  const { requests, loading, error, refresh } = usePackageRequests();

  const streamerRequests = requests.filter((r) => r.publisherId === publisherId);

  if (loading) {
    return (
      <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
        Yükleniyor...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm font-mono" style={{ color: "#FF5050" }}>{error}</p>
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
        Paket Talepleri · {streamerRequests.length} kayıt
      </p>

      {streamerRequests.length === 0 ? (
        <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
          Bu yayıncıya ait talep bulunmuyor.
        </p>
      ) : (
        <div className="space-y-3">
          {streamerRequests.map((r) => (
            <RequestCard key={r.id} request={r} onRefresh={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}