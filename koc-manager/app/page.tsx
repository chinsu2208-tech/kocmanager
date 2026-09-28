import { getSupabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Row = {
  koc_id: string;
  koc_name: string;
  totalViews: number;
  totalRevenue: number;
  avgCvr: number | null;
  checkins: number;
};

export default async function DashboardPage() {
  const supabase = getSupabase();

  const [{ data: campaigns }, { data: kocs }, { data: checkins }] = await Promise.all([
    supabase.from("campaign").select("*"),
    supabase.from("koc").select("*"),
    supabase.from("performance_checkin").select("*"),
  ]);

  const kocById = new Map((kocs || []).map((k) => [k.id, k]));
  const campaignById = new Map((campaigns || []).map((c) => [c.id, c]));

  const byKoc = new Map<string, Row>();
  for (const ci of checkins || []) {
    const campaign = campaignById.get(ci.campaign_id);
    if (!campaign) continue;
    const koc = kocById.get(campaign.koc_id);
    if (!koc) continue;
    const row = byKoc.get(koc.id) || {
      koc_id: koc.id,
      koc_name: koc.name,
      totalViews: 0,
      totalRevenue: 0,
      avgCvr: null,
      checkins: 0,
    };
    row.totalViews += ci.views || 0;
    row.totalRevenue += ci.revenue_eur || 0;
    row.checkins += 1;
    if (ci.cvr != null) {
      row.avgCvr = row.avgCvr == null ? ci.cvr : (row.avgCvr + ci.cvr) / 2;
    }
    byKoc.set(koc.id, row);
  }

  const ranking = Array.from(byKoc.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);

  const activeCampaigns = (campaigns || []).filter((c) => c.status === "posted" || c.status === "confirmed").length;
  const totalCheckins = (checkins || []).length;
  const avgCvrOverall =
    (checkins || []).filter((c) => c.cvr != null).reduce((s, c) => s + c.cvr, 0) /
    Math.max(1, (checkins || []).filter((c) => c.cvr != null).length);

  const emptyState = (kocs || []).length === 0 && (campaigns || []).length === 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Tổng quan hiệu quả KOC &amp; chiến dịch đang chạy</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatTile label="Chiến dịch đang chạy" value={String(activeCampaigns)} />
        <StatTile label="CVR trung bình" value={checkins && checkins.length ? `${avgCvrOverall.toFixed(1)}%` : "—"} />
        <StatTile label="Lượt cập nhật hiệu quả" value={String(totalCheckins)} />
      </div>

      {emptyState ? (
        <div className="border border-dashed border-line rounded-lg p-10 text-center text-sm text-muted">
          Chưa có dữ liệu. Bắt đầu bằng cách{" "}
          <Link href="/koc" className="text-accent underline">
            thêm KOC
          </Link>{" "}
          rồi tạo{" "}
          <Link href="/campaigns" className="text-accent underline">
            chiến dịch
          </Link>
          .
        </div>
      ) : (
        <div className="bg-surface border border-line rounded-lg p-6">
          <h2 className="text-xs uppercase tracking-wide text-muted mb-4">Xếp hạng KOC theo hiệu quả</h2>
          {ranking.length === 0 ? (
            <p className="text-sm text-muted">Chưa có lượt cập nhật hiệu quả nào — vào một chiến dịch để bắt đầu ghi nhận.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted border-b border-line">
                  <th className="py-2">KOC</th>
                  <th className="py-2">Tổng views</th>
                  <th className="py-2">CVR TB</th>
                  <th className="py-2">Doanh thu quy đổi</th>
                  <th className="py-2">Số lần cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => (
                  <tr key={r.koc_id} className="border-b border-line last:border-0">
                    <td className="py-2 font-medium">
                      {i === 0 && <span className="mr-1">🏆</span>}
                      {r.koc_name}
                    </td>
                    <td className="py-2 tabular-nums">{r.totalViews.toLocaleString("vi-VN")}</td>
                    <td className="py-2 tabular-nums">{r.avgCvr != null ? `${r.avgCvr.toFixed(1)}%` : "—"}</td>
                    <td className="py-2 tabular-nums">€{r.totalRevenue.toLocaleString("vi-VN")}</td>
                    <td className="py-2 tabular-nums">{r.checkins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-lg p-4">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
