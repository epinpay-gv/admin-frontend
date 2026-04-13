export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Hoşgeldin, BURAYA İSİM GELECEK !
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Genel duruma göz at.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Toplam İşlem", value: "₺ 2,847,320", change: "+12.4%", positive: true },
          { label: "Aktif Kullanıcı", value: "14,829", change: "+5.2%", positive: true },
          { label: "Bekleyen İşlem", value: "342", change: "-3.1%", positive: false },
          { label: "Günlük Gelir", value: "₺ 48,210", change: "+8.7%", positive: true },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5 border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 font-mono mb-2">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-white tracking-tight mb-2">
              {stat.value}
            </p>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
              style={{
                background: stat.positive ? "rgba(0,198,162,0.15)" : "rgba(255,80,80,0.15)",
                color: stat.positive ? "#00C6A2" : "#FF5050",
              }}
            >
              {stat.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}