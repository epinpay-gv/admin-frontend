"use client";

// src/app/(private)/streamers/[id]/page.tsx

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/spinner/Spinner";

import { useStreamer }        from "@/features/streamers/hooks/useStreamer";
import { usePackageTemplate } from "@/features/streamers/hooks/usePackageTemplate";
import { useCountryVariant }  from "@/features/streamers/hooks/useCountryVariant";
import { usePackageRequest }  from "@/features/streamers/hooks/usePackageRequest";

import {
  STREAMER_STATUS,
  STREAMER_STATUS_LABELS,
  PACKAGE_STATUS,
  PACKAGE_STATUS_LABELS,
  TEMPLATE_STATUS,
  TEMPLATE_STATUS_LABELS,
  VARIANT_STATUS,
  VARIANT_STATUS_LABELS,
  PACKAGE_REQUEST_STATUS,
  PACKAGE_REQUEST_STATUS_LABELS,
  PACKAGE_REQUEST_TYPE,
  PACKAGE_REQUEST_TYPE_LABELS,
  PACKAGE_LEVEL_LABELS,
  CONTENT_FIELD_TYPE_LABELS,
} from "@/features/streamers/types";

// ─── Renk Sabitleri ───────────────────────────────────────────────────────────

const C = {
  green:  { bg: "rgba(0,198,162,0.15)",   color: "#00C6A2" },
  red:    { bg: "rgba(255,80,80,0.15)",   color: "#FF5050" },
  yellow: { bg: "rgba(255,180,0,0.15)",   color: "#FFB400" },
  blue:   { bg: "rgba(0,133,255,0.15)",   color: "#0085FF" },
  purple: { bg: "rgba(160,80,255,0.15)",  color: "#A050FF" },
  gray:   { bg: "rgba(160,160,160,0.15)", color: "#A0A0A0" },
} as const;

const STREAMER_STATUS_C  = { [STREAMER_STATUS.PENDING]: C.yellow,  [STREAMER_STATUS.APPROVED]: C.green,  [STREAMER_STATUS.REJECTED]: C.red };
const PACKAGE_STATUS_C   = { [PACKAGE_STATUS.ACTIVE]: C.green,    [PACKAGE_STATUS.EXPIRED]: C.red,      [PACKAGE_STATUS.NONE]: C.gray };
const TEMPLATE_STATUS_C  = { [TEMPLATE_STATUS.ACTIVE]: C.green,   [TEMPLATE_STATUS.INACTIVE]: C.gray };
const VARIANT_STATUS_C   = { [VARIANT_STATUS.ACTIVE]: C.green,    [VARIANT_STATUS.INACTIVE]: C.gray };
const REQUEST_STATUS_C   = { [PACKAGE_REQUEST_STATUS.PENDING]: C.yellow, [PACKAGE_REQUEST_STATUS.APPROVED]: C.green, [PACKAGE_REQUEST_STATUS.REJECTED]: C.red };
const REQUEST_TYPE_C     = { [PACKAGE_REQUEST_TYPE.RENEWAL]: C.blue, [PACKAGE_REQUEST_TYPE.UPGRADE]: C.purple };

// ─── Küçük Bileşenler ─────────────────────────────────────────────────────────

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-6" style={{ background: "var(--background-card)", borderColor: "var(--border)" }}>
      <p className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4" style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            {item.label}
          </p>
          <div className="text-sm" style={{ color: "var(--text-primary)" }}>
            {item.value ?? "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

function fmt(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR");
}

// ─── Entity Detay Bileşenleri ─────────────────────────────────────────────────

function StreamerDetail({ id }: { id: number }) {
  const { streamer, loading, error } = useStreamer(id);
  if (loading) return <Spinner />;
  if (!streamer) return <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>{error ?? "Bulunamadı."}</p>;

  const sc = STREAMER_STATUS_C[streamer.streamerStatus];
  const pc = PACKAGE_STATUS_C[streamer.packageStatus];

  return (
    <div className="space-y-4">
      <Section title="Yayıncı Bilgileri">
        <InfoGrid items={[
          { label: "Ad Soyad",       value: streamer.name },
          { label: "E-posta",        value: streamer.email },
          { label: "Ülke",           value: `${streamer.countryCode} · ${streamer.countryName}` },
          { label: "Başvuru Durumu", value: <Badge label={STREAMER_STATUS_LABELS[streamer.streamerStatus]} bg={sc.bg} color={sc.color} /> },
          { label: "Kayıt Tarihi",   value: fmt(streamer.createdAt) },
          { label: "Güncellendi",    value: fmt(streamer.updatedAt) },
        ]} />
      </Section>

      <Section title="Paket Bilgileri">
        <InfoGrid items={[
          { label: "Paket Durumu",    value: <Badge label={PACKAGE_STATUS_LABELS[streamer.packageStatus]} bg={pc.bg} color={pc.color} /> },
          { label: "Aktif Paket",     value: streamer.currentPackageName },
          { label: "Paket Başlangıç", value: fmt(streamer.packageStartDate) },
          { label: "Paket Bitiş",     value: fmt(streamer.packageEndDate) },
        ]} />
      </Section>
    </div>
  );
}

function TemplateDetail({ id }: { id: number }) {
  const { template, loading, error } = usePackageTemplate(id);
  if (loading) return <Spinner />;
  if (!template) return <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>{error ?? "Bulunamadı."}</p>;

  const sc = TEMPLATE_STATUS_C[template.status];

  return (
    <div className="space-y-4">
      <Section title="Şablon Bilgileri">
        <InfoGrid items={[
          { label: "Ad",          value: template.name },
          { label: "Seviye",      value: PACKAGE_LEVEL_LABELS[template.level] },
          { label: "Durum",       value: <Badge label={TEMPLATE_STATUS_LABELS[template.status]} bg={sc.bg} color={sc.color} /> },
          { label: "Açıklama",    value: template.description },
          { label: "Oluşturulma", value: fmt(template.createdAt) },
          { label: "Güncellendi", value: fmt(template.updatedAt) },
        ]} />
      </Section>

      <Section title={`Paket İçerikleri · ${template.contents.length} madde`}>
        {template.contents.length === 0 ? (
          <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>İçerik eklenmemiş.</p>
        ) : (
          <div className="space-y-2">
            {template.contents.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ background: "var(--background-secondary)", border: "1px solid var(--border)" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.label}</p>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {c.key} · {CONTENT_FIELD_TYPE_LABELS[c.fieldType]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
                    {c.defaultValue !== null ? String(c.defaultValue) : "—"}
                  </span>
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md"
                    style={{ background: c.isActive ? "rgba(0,198,162,0.1)" : "rgba(160,160,160,0.1)", color: c.isActive ? "#00C6A2" : "#A0A0A0" }}
                  >
                    {c.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function VariantDetail({ id }: { id: number }) {
  const { variant, loading, error } = useCountryVariant(id);
  if (loading) return <Spinner />;
  if (!variant) return <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>{error ?? "Bulunamadı."}</p>;

  const sc = VARIANT_STATUS_C[variant.status];

  return (
    <div className="space-y-4">
      <Section title="Varyant Bilgileri">
        <InfoGrid items={[
          { label: "Şablon",        value: variant.templateName },
          { label: "Seviye",        value: PACKAGE_LEVEL_LABELS[variant.templateLevel] },
          { label: "Ülke",          value: `${variant.countryCode} · ${variant.countryName}` },
          { label: "Para Birimi",   value: variant.currency },
          { label: "Paket Süresi",  value: `${variant.durationDays} gün` },
          { label: "Durum",         value: <Badge label={VARIANT_STATUS_LABELS[variant.status]} bg={sc.bg} color={sc.color} /> },
          { label: "Güncellendi",   value: fmt(variant.updatedAt) },
        ]} />
      </Section>

      <Section title={`Ülkeye Özel Değerler · ${variant.contents.length} override`}>
        {variant.contents.length === 0 ? (
          <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
            Override yok — şablon varsayılanları geçerli.
          </p>
        ) : (
          <div className="space-y-2">
            {variant.contents.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ background: "var(--background-secondary)", border: "1px solid var(--border)" }}
              >
                <p className="text-sm font-mono" style={{ color: "var(--text-primary)" }}>{c.key}</p>
                <span className="text-sm font-mono font-semibold" style={{ color: "#00C6A2" }}>
                  {c.overrideValue !== null ? String(c.overrideValue) : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function RequestDetail({ id }: { id: number }) {
  const { request, loading, error, actionLoading, actionError, approve, reject } = usePackageRequest(id);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);

  if (loading) return <Spinner />;
  if (!request) return <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>{error ?? "Bulunamadı."}</p>;

  const sc = REQUEST_STATUS_C[request.status];
  const tc = REQUEST_TYPE_C[request.requestType];
  const isPending = request.status === PACKAGE_REQUEST_STATUS.PENDING;

  return (
    <div className="space-y-4">
      <Section title="Talep Bilgileri">
        <InfoGrid items={[
          { label: "Talep Türü",  value: <Badge label={PACKAGE_REQUEST_TYPE_LABELS[request.requestType]} bg={tc.bg} color={tc.color} /> },
          { label: "Durum",       value: <Badge label={PACKAGE_REQUEST_STATUS_LABELS[request.status]} bg={sc.bg} color={sc.color} /> },
          { label: "Talep Tarihi", value: fmt(request.createdAt) },
          { label: "İşlem Tarihi", value: fmt(request.processedAt) },
        ]} />
      </Section>

      <Section title="Yayıncı">
        <InfoGrid items={[
          { label: "Ad Soyad", value: request.publisherName },
          { label: "E-posta",  value: request.publisherEmail },
          { label: "Ülke",     value: `${request.countryCode} · ${request.countryName}` },
        ]} />
      </Section>

      <Section title="Paket Geçişi">
        <InfoGrid items={[
          { label: "Mevcut Paket",  value: request.currentPackageName },
          { label: "Talep Edilen",  value: request.requestedPackageName },
          { label: "Yayıncı Notu", value: request.publisherNote },
        ]} />
      </Section>

      {/* Admin notu — sadece işlem yapılmışsa */}
      {request.adminNote && (
        <div
          className="rounded-xl border p-4"
          style={{
            background: request.status === PACKAGE_REQUEST_STATUS.REJECTED ? "rgba(255,80,80,0.06)" : "rgba(0,198,162,0.06)",
            borderColor: request.status === PACKAGE_REQUEST_STATUS.REJECTED ? "rgba(255,80,80,0.2)" : "rgba(0,198,162,0.2)",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
            style={{ color: request.status === PACKAGE_REQUEST_STATUS.REJECTED ? "#FF5050" : "#00C6A2" }}>
            Admin Notu
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{request.adminNote}</p>
        </div>
      )}

      {/* Onay / Red — sadece beklemedeyse */}
      {isPending && (
        <Section title="Karar">
          {actionError && (
            <p className="text-sm font-mono mb-4" style={{ color: "#FF5050" }}>{actionError}</p>
          )}

          {!showReject ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => approve()}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
              >
                <CheckCircle size={15} />
                {actionLoading ? "İşleniyor..." : "Onayla"}
              </button>
              <button
                onClick={() => setShowReject(true)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border disabled:opacity-50"
                style={{ background: "var(--background-secondary)", borderColor: "rgba(255,80,80,0.3)", color: "#FF5050" }}
              >
                <XCircle size={15} />
                Reddet
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                  Red Sebebi <span style={{ color: "#FF5050" }}>*</span>
                </label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Red sebebini yazın..."
                  rows={3}
                  className="rounded-lg border px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => { await reject(rejectNote); setShowReject(false); setRejectNote(""); }}
                  disabled={actionLoading || !rejectNote.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: "#FF5050" }}
                >
                  <XCircle size={15} />
                  {actionLoading ? "İşleniyor..." : "Reddet"}
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
        </Section>
      )}
    </div>
  );
}

// ─── Route Tespiti ────────────────────────────────────────────────────────────

// URL pattern'i: /streamers/[id], /streamers/package-templates/[id], vb.
// Bu sayfalar ayrı route klasörlerinde olacak. Bu dosya /streamers/[id] içindir.
// package-templates/[id], country-variants/[id], package-requests/[id]
// için ayrı page.tsx dosyaları oluşturulmalı — ama içerik aynı bileşenleri kullanır.

type EntityType = "streamer" | "template" | "variant" | "request";

const ENTITY_TITLE: Record<EntityType, string> = {
  streamer: "Yayıncı Detayı",
  template: "Paket Şablonu",
  variant:  "Ülke Varyantı",
  request:  "Paket Talebi",
};

// ─── Sayfa ────────────────────────────────────────────────────────────────────

export default function StreamerDetailPage({
  params,
  entityType = "streamer",
}: {
  params: Promise<{ id: string }>;
  entityType?: EntityType;
}) {
  const { id } = use(params);
  const router = useRouter();
  const numericId = Number(id);

  const renderContent = () => {
    if (entityType === "streamer") return <StreamerDetail id={numericId} />;
    if (entityType === "template") return <TemplateDetail id={numericId} />;
    if (entityType === "variant")  return <VariantDetail  id={numericId} />;
    if (entityType === "request")  return <RequestDetail  id={numericId} />;
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      {/* Üst Bar */}
      <div
        className="shrink-0 flex items-center gap-3 px-6 py-4 mb-4 rounded-xl border"
        style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
          style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {ENTITY_TITLE[entityType]}
          </h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>#{id}</p>
        </div>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
        {renderContent()}
      </div>
    </div>
  );
}