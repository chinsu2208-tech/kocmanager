import { getSupabase } from "@/lib/supabase";
import { STATUS_LABEL, STATUS_COLOR, CampaignStatus } from "@/lib/types";
import { addCheckin, updateCampaignStatus, updatePostUrl } from "../actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const STATUS_FLOW: CampaignStatus[] = ["pending", "confirmed", "posted", "completed", "cancelled"];

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const { data: campaign } = await supabase
    .from("campaign")
    .select("*, koc(*), product(*)")
    .eq("id", params.id)
    .maybeSingle();

  if (!campaign) return notFound();

  const { data: checkins } = await supabase
    .from("performance_checkin")
    .select("*")
    .eq("campaign_id", params.id)
    .order("check_date", { ascending: true });

  const sorted = checkins || [];
  const latest = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  const delta = (a?: number | null, b?: number | null) => (a != null && b != null ? a - b : null);

  const boundUpdatePostUrl = updatePostUrl.bind(null, campaign.id);
  const boundAddCheckin = addCheckin.bind(null, campaign.id);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{campaign.campaign_name}</h1>
          <p className="text-sm text-muted mt-1">
            {campaign.koc?.name} ({campaign.koc?.handle}) · {campaign.product?.name}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${STATUS_COLOR[campaign.status as CampaignStatus]}`}>
          {STATUS_LABEL[campaign.status as CampaignStatus]}
        </span>
      </div>

      <div className="bg-surface border border-line rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted mr-1">Cập nhật trạng thái:</span>
          {STATUS_FLOW.map((s) => (
            <form key={s} action={updateCampaignStatus.bind(null, campaign.id, s)}>
              <button
                className={`px-3 py-1 rounded-full text-xs border ${
                  campaign.status === s ? "border-accent text-accent" : "border-line text-muted hover:border-accent"
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            </form>
          ))}
        </div>

        <form action={boundUpdatePostUrl} className="flex gap-2">
          <input
            name="post_url"
            defaultValue={campaign.post_url || ""}
            placeholder="Link bài đăng TikTok (https://www.tiktok.com/@...)"
            className="flex-1 border border-line rounded px-3 py-2 text-sm"
          />
          <button className="bg-ink text-white rounded px-4 py-2 text-sm">Lưu link</button>
        </form>
        {campaign.post_url && (
          <a href={campaign.post_url} target="_blank" className="text-xs text-accent hover:underline">
            Mở bài đăng ↗
          </a>
        )}
      </div>

      {latest && (
        <div className="grid grid-cols-4 gap-4">
          <MetricTile label="Views" value={latest.views} delta={delta(latest.views, prev?.views)} />
          <MetricTile label="Likes" value={latest.likes} delta={delta(latest.likes, prev?.likes)} />
          <MetricTile label="CVR" value={latest.cvr} suffix="%" delta={delta(latest.cvr, prev?.cvr)} />
          <MetricTile label="Doanh thu" value={latest.revenue_eur} prefix="€" delta={delta(latest.revenue_eur, prev?.revenue_eur)} />
        </div>
      )}

      <div className="bg-surface border border-line rounded-lg p-5">
        <h2 className="text-xs uppercase tracking-wide text-muted mb-4">Cập nhật hiệu quả mới</h2>
        <form action={boundAddCheckin} className="grid grid-cols-4 gap-3">
          <input name="check_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="border border-line rounded px-3 py-2 text-sm" />
          <input name="views" type="number" placeholder="Lượt xem" className="border border-line rounded px-3 py-2 text-sm" />
          <input name="likes" type="number" placeholder="Lượt thích" className="border border-line rounded px-3 py-2 text-sm" />
          <input name="comments" type="number" placeholder="Bình luận" className="border border-line rounded px-3 py-2 text-sm" />
          <input name="shares" type="number" placeholder="Chia sẻ" className="border border-line rounded px-3 py-2 text-sm" />
          <input name="cvr" type="number" step="0.1" placeholder="CVR (%)" className="border border-line rounded px-3 py-2 text-sm" />
          <input name="revenue_eur" type="number" placeholder="Doanh thu quy đổi (€)" className="border border-line rounded px-3 py-2 text-sm" />
          <input name="notes" placeholder="Ghi chú" className="border border-line rounded px-3 py-2 text-sm" />
          <button className="col-span-4 bg-accent text-white rounded py-2 text-sm font-medium hover:opacity-90">
            + Ghi nhận cập nhật
          </button>
        </form>
      </div>

      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-line">
          <h2 className="text-xs uppercase tracking-wide text-muted">Lịch sử theo dõi ({sorted.length} lần cập nhật)</h2>
        </div>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted p-5">Chưa có lần cập nhật nào — ghi nhận lần đầu ở form phía trên.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted border-b border-line bg-page">
                <th className="py-2 px-4">Ngày</th>
                <th className="py-2 px-4">Views</th>
                <th className="py-2 px-4">Likes</th>
                <th className="py-2 px-4">Bình luận</th>
                <th className="py-2 px-4">Chia sẻ</th>
                <th className="py-2 px-4">CVR</th>
                <th className="py-2 px-4">Doanh thu</th>
                <th className="py-2 px-4">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {[...sorted].reverse().map((ci) => (
                <tr key={ci.id} className="border-b border-line last:border-0">
                  <td className="py-2 px-4 tabular-nums">{ci.check_date}</td>
                  <td className="py-2 px-4 tabular-nums">{ci.views?.toLocaleString("vi-VN") ?? "—"}</td>
                  <td className="py-2 px-4 tabular-nums">{ci.likes?.toLocaleString("vi-VN") ?? "—"}</td>
                  <td className="py-2 px-4 tabular-nums">{ci.comments ?? "—"}</td>
                  <td className="py-2 px-4 tabular-nums">{ci.shares ?? "—"}</td>
                  <td className="py-2 px-4 tabular-nums">{ci.cvr != null ? `${ci.cvr}%` : "—"}</td>
                  <td className="py-2 px-4 tabular-nums">{ci.revenue_eur != null ? `€${ci.revenue_eur}` : "—"}</td>
                  <td className="py-2 px-4 text-muted">{ci.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  delta,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number | null;
  delta: number | null;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="bg-surface border border-line rounded-lg p-4">
      <div className="text-xs text-muted mb-1">{label} (mới nhất)</div>
      <div className="text-xl font-semibold tabular-nums">
        {value != null ? `${prefix}${value.toLocaleString("vi-VN")}${suffix}` : "—"}
      </div>
      {delta != null && (
        <div className={`text-xs mt-1 ${delta >= 0 ? "text-emerald-600" : "text-red-600"}`}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toLocaleString("vi-VN")}
          {suffix} so với lần trước
        </div>
      )}
    </div>
  );
}
