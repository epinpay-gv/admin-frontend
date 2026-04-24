"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageState } from "@/components/common/page-state/PageState";
import { PALETTE } from "@/lib/status-color";
import { useStreamer } from "@/features/streamers/hooks/useStreamer";
import PackageCard from "@/features/streamers/components/PackageCard";
import RequestList from "@/features/streamers/components/RequestList";
import {
  STREAMER_STATUS,
  STREAMER_STATUS_LABELS,
} from "@/features/streamers/types";

const STREAMER_STATUS_COLOR = {
  [STREAMER_STATUS.ACTIVE]:       PALETTE.green,
  [STREAMER_STATUS.UNDER_REVIEW]: PALETTE.yellow,
  [STREAMER_STATUS.SUSPENDED]:    PALETTE.red,
  [STREAMER_STATUS.BANNED]:       PALETTE.red,
};

export default function StreamerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { streamer, loading, error } = useStreamer(id);

  const pageError = error || (!streamer && !loading ? "Yayıncı bulunamadı." : null);

  return (
    <PageState
      loading={loading}
      error={pageError}
      onRetry={() => router.back()}
    >
      {streamer && (
        <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
          <div
            className="shrink-0 flex items-center gap-3 px-6 py-4 mb-4 rounded-xl border"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <button
              onClick={() => router.back()}
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
              style={{
                background:   "var(--background-secondary)",
                borderColor:  "var(--border)",
                color:        "var(--text-muted)",
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
                  {streamer.fullName}
                  {streamer.nickName && (
                    <span
                      className="ml-2 text-sm font-normal"
                      style={{ color: "var(--text-muted)" }}
                    >
                      @{streamer.nickName}
                    </span>
                  )}
                </h1>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: STREAMER_STATUS_COLOR[streamer.streamerStatus].bg,
                    color:      STREAMER_STATUS_COLOR[streamer.streamerStatus].color,
                  }}
                >
                  {STREAMER_STATUS_LABELS[streamer.streamerStatus]}
                </span>
              </div>

              <p
                className="text-xs font-mono mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {streamer.id.slice(0, 8)}…
                {streamer.email && ` · ${streamer.email}`}
                {streamer.geoCountry?.length > 0 && ` · ${streamer.geoCountry.join(", ")}`}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10 space-y-4">
    
            <PackageCard streamer={streamer} />
            <RequestList streamerId={streamer.id} />
          </div>
        </div>
      )}
    </PageState>
  );
}