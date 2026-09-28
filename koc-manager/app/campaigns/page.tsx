import { getSupabase } from "@/lib/supabase";
import { CATEGORIES, STATUS_LABEL, STATUS_COLOR, CampaignStatus } from "@/lib/types";
import { createCampaign } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const supabase = getSupabase();
  const [{ data: campaigns }, { data: kocs }] = await Promise.all([
    supabase.from("campaign").select("*, koc(*), product(*)").order("created_at", { ascending: false }),
    supabase.from("koc").select("*").order("name"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Chiến dịch KOC</h1>
        <p className="text-sm text-muted mt-1">Gán KOC đăng bài cho sản phẩm, theo dõi trạng thái</p>
      </div>

      <form action={createCampaign} className="bg-surface border border-line rounded-lg p-5 grid grid-cols-3 gap-3">
        <select name="koc_id" required className="border border-line rounded px-3 py-2 text-sm col-span-1">
          <option value="">— Chọn KOC —</option>
          {(kocs || []).map((k) => (
            <option key={k.id} value={k.id}>{k.name} ({k.handle})</option>
          ))}
        </select>
        <input name="product_name" placeholder="Tên sản phẩm" required className="border border-line rounded px-3 py-2 text-sm col-span-1" />
        <select name="category" className="border border-line rounded px-3 py-2 text-sm col-span-1">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="campaign_name" placeholder="Tên chiến dịch" required className="border border-line rounded px-3 py-2 text-sm col-span-1" />
        <input name="budget_eur" type="number" placeholder="Ngân sách (€)" className="border border-line rounded px-3 py-2 text-sm col-span-1" />
        <input name="start_date" type="date" className="border border-line rounded px-3 py-2 text-sm col-span-1" />
        <button type="submit" className="col-span-3 bg-accent text-white rounded py-2 text-sm font-medium hover:opacity-90">
          + Tạo chiến dịch
        </button>
      </form>

      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted border-b border-line bg-page">
              <th className="py-2 px-4">KOC</th>
              <th className="py-2 px-4">Sản phẩm</th>
              <th className="py-2 px-4">Chiến dịch</th>
              <th className="py-2 px-4">Ngân sách</th>
              <th className="py-2 px-4">Trạng thái</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {(campaigns || []).length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-muted">Chưa có chiến dịch nào — tạo chiến dịch đầu tiên ở form phía trên.</td></tr>
            )}
            {(campaigns || []).map((c: any) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="py-2 px-4 font-medium">{c.koc?.name}</td>
                <td className="py-2 px-4">{c.product?.name}</td>
                <td className="py-2 px-4">{c.campaign_name}</td>
                <td className="py-2 px-4 tabular-nums">€{c.budget_eur}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLOR[c.status as CampaignStatus]}`}>
                    {STATUS_LABEL[c.status as CampaignStatus]}
                  </span>
                </td>
                <td className="py-2 px-4 text-right">
                  <Link href={`/campaigns/${c.id}`} className="text-accent text-xs hover:underline">
                    Theo dõi hiệu quả →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
