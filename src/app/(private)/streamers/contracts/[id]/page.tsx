"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/page-state/PageState";
import { PALETTE } from "@/lib/status-color";
import { useContract } from "@/features/streamers/hooks/useContracts";
import {
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
} from "@/features/streamers/types";

const CONTRACT_STATUS_COLOR = {
  [CONTRACT_STATUS.PENDING_UPLOAD]: PALETTE.gray,
  [CONTRACT_STATUS.UNDER_REVIEW]:   PALETTE.yellow,
  [CONTRACT_STATUS.APPROVED]:       PALETTE.green,
  [CONTRACT_STATUS.REJECTED]:       PALETTE.red,
  [CONTRACT_STATUS.EXPIRED]:        PALETTE.gray,
};

function fmt(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR");
}


export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }  = use(params);
  const router  = useRouter();

  const { contract, loading, error, approve, reject, updateStatus, refresh } =
    useContract(id);

  // ── Onay formu state ──
  const [approveForm, setApproveForm] = useState({
    start_date: "",
    end_date:   "",
    notes:      "",
  });

  // ── Red formu state ──
  const [rejectNote, setRejectNote] = useState("");

  // ── UI state ──
  const [showApprove, setShowApprove] = useState(false);
  const [showReject,  setShowReject]  = useState(false);
  const [saving, setSaving]           = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Bugünü varsayılan başlangıç tarihi olarak ayarla
  useEffect(() => {
    const today    = new Date().toISOString().split("T")[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    setApproveForm((p) => ({ ...p, start_date: today, end_date: nextYear }));
  }, []);

  const handleApprove = async () => {
    setSaving(true);
    setActionError(null);
    try {
      await approve({
        start_date: approveForm.start_date,
        end_date:   approveForm.end_date,
        notes:      approveForm.notes || undefined,
      });
      setShowApprove(false);
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) return;
    setSaving(true);
    setActionError(null);
    try {
      await reject({ notes: rejectNote });
      setShowReject(false);
      setRejectNote("");
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // ── Sayfa durum yönetimi ──
  const pageError = error || (!contract && !loading ? "Sözleşme bulunamadı." : null);
  const sc = contract ? CONTRACT_STATUS_COLOR[contract.status] : null;
  const isReviewable =
    contract?.status === CONTRACT_STATUS.PENDING_UPLOAD ||
    contract?.status === CONTRACT_STATUS.UNDER_REVIEW;

  return (
    <PageState loading={loading} error={pageError} onRetry={() => router.back()}>
      {contract && (
        <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
          {/* ── Üst Bar ── */}
          <div
            className="shrink-0 flex items-center gap-3 px-6 py-4 mb-4 rounded-xl border"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <button
              onClick={() => router.back()}
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border"
              style={{
                background:  "var(--background-secondary)",
                borderColor: "var(--border)",
                color:       "var(--text-muted)",
              }}
            >
              <ArrowLeft size={16} />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="text-lg font-semibold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {contract.streamer?.fullName ?? "Yayıncı"}
                  {contract.package?.name && (
                    <span
                      className="ml-2 text-sm font-normal"
                      style={{ color: "var(--text-muted)" }}
                    >
                      · {contract.package.name}
                    </span>
                  )}
                </h1>
                {sc && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    {CONTRACT_STATUS_LABELS[contract.status]}
                  </span>
                )}
              </div>
              <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                {id.slice(0, 8)}… · Başvuru: {fmt(contract.createdAt)}
              </p>
            </div>
          </div>

          {/* ── İçerik ── */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10 space-y-4">
            {/* Sözleşme Bilgileri */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Sözleşme Bilgileri
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Yayıncı</p>
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {contract.streamer?.fullName ?? "—"}
                  </p>
                  {contract.streamer?.email && (
                    <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                      {contract.streamer.email}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Paket</p>
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {contract.package?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Başlangıç</p>
                  <p className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
                    {fmt(contract.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Bitiş</p>
                  <p className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
                    {fmt(contract.endDate)}
                  </p>
                </div>

                {contract.notes && (
                  <div className="col-span-2 sm:col-span-4">
                    <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Notlar</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{contract.notes}</p>
                  </div>
                )}

                {contract.uploadedDocumentUrl && (
                  <div className="col-span-2 sm:col-span-4">
                    <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Yüklenen Belge</p>
                    <a
                      href={contract.uploadedDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                      style={{ color: "#0085FF" }}
                    >
                      Belgeyi Görüntüle
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Onay / Red paneli */}
            {isReviewable && (
              <div
                className="rounded-xl border p-6"
                style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  İşlem
                </p>

                {actionError && (
                  <p className="text-xs font-mono mb-3" style={{ color: "#FF5050" }}>
                    {actionError}
                  </p>
                )}

                {/* Onay formu */}
                {showApprove && (
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          Başlangıç Tarihi
                        </label>
                        <input
                          type="date"
                          value={approveForm.start_date}
                          onChange={(e) => setApproveForm((p) => ({ ...p, start_date: e.target.value }))}
                          className="h-9 rounded-lg border px-3 text-sm outline-none"
                          style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          Bitiş Tarihi
                        </label>
                        <input
                          type="date"
                          value={approveForm.end_date}
                          onChange={(e) => setApproveForm((p) => ({ ...p, end_date: e.target.value }))}
                          className="h-9 rounded-lg border px-3 text-sm outline-none"
                          style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          Not (Opsiyonel)
                        </label>
                        <input
                          value={approveForm.notes}
                          onChange={(e) => setApproveForm((p) => ({ ...p, notes: e.target.value }))}
                          placeholder="Onay notu..."
                          className="h-9 rounded-lg border px-3 text-sm outline-none"
                          style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleApprove}
                        disabled={saving || !approveForm.start_date || !approveForm.end_date}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
                      >
                        <CheckCircle size={14} />
                        {saving ? "İşleniyor..." : "Onayla"}
                      </button>
                      <button
                        onClick={() => setShowApprove(false)}
                        className="px-4 py-2 rounded-lg text-sm border"
                        style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                )}

                {/* Red formu */}
                {showReject && (
                  <div className="space-y-3 mb-4">
                    <textarea
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      placeholder="Red sebebini yazın... *"
                      rows={3}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
                      style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReject}
                        disabled={saving || !rejectNote.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                        style={{ background: "#FF5050" }}
                      >
                        <XCircle size={14} />
                        {saving ? "İşleniyor..." : "Reddet"}
                      </button>
                      <button
                        onClick={() => { setShowReject(false); setRejectNote(""); }}
                        className="px-4 py-2 rounded-lg text-sm border"
                        style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                )}

                {/* Ana butonlar */}
                {!showApprove && !showReject && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowApprove(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
                    >
                      <CheckCircle size={14} />
                      Onayla
                    </button>
                    <button
                      onClick={() => setShowReject(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border"
                      style={{ background: "var(--background-secondary)", borderColor: "rgba(255,80,80,0.3)", color: "#FF5050" }}
                    >
                      <XCircle size={14} />
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </PageState>
  );
}