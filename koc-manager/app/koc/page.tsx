import { getSupabase } from "@/lib/supabase";
import { REGIONS, NICHES } from "@/lib/types";
import { createKoc, deleteKoc } from "./actions";

export const dynamic = "force-dynamic";

export default async function KocPage() {
  const supabase = getSupabase();
  const { data: kocs } = await supabase.from("koc").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Danh sách KOC</h1>
        <p className="text-sm text-muted mt-1">Quản lý hồ sơ KOC đang hợp tác</p>
      </div>

      <form action={createKoc} className="bg-surface border border-line rounded-lg p-5 grid grid-cols-3 gap-3">
        <input name="name" placeholder="Tên KOC" required className="border border-line rounded px-3 py-2 text-sm col-span-1" />
        <input name="handle" placeholder="Handle (vd @tenkoc)" required className="border border-line rounded px-3 py-2 text-sm col-span-1" />
        <select name="region" className="border border-line rounded px-3 py-2 text-sm col-span-1">
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select name="niche" className="border border-line rounded px-3 py-2 text-sm col-span-1">
          {NICHES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <input name="followers" type="number" placeholder="Số follower" className="border border-line rounded px-3 py-2 text-sm col-span-1" />
        <input name="base_price_eur" type="number" placeholder="Giá booking (€)" className="border border-line rounded px-3 py-2 text-sm col-span-1" />
        <button type="submit" className="col-span-3 bg-accent text-white rounded py-2 text-sm font-medium hover:opacity-90">
          + Thêm KOC
        </button>
      </form>

      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted border-b border-line bg-page">
              <th className="py-2 px-4">Tên</th>
              <th className="py-2 px-4">Handle</th>
              <th className="py-2 px-4">Khu vực</th>
              <th className="py-2 px-4">Ngách</th>
              <th className="py-2 px-4">Follower</th>
              <th className="py-2 px-4">Giá (€)</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {(kocs || []).length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-muted">Chưa có KOC nào — thêm KOC đầu tiên ở form phía trên.</td></tr>
            )}
            {(kocs || []).map((k) => (
              <tr key={k.id} className="border-b border-line last:border-0">
                <td className="py-2 px-4 font-medium">{k.name}</td>
                <td className="py-2 px-4 text-muted">{k.handle}</td>
                <td className="py-2 px-4">{k.region}</td>
                <td className="py-2 px-4">{k.niche}</td>
                <td className="py-2 px-4 tabular-nums">{k.followers?.toLocaleString("vi-VN")}</td>
                <td className="py-2 px-4 tabular-nums">€{k.base_price_eur}</td>
                <td className="py-2 px-4 text-right">
                  <form action={deleteKoc.bind(null, k.id)}>
                    <button className="text-xs text-muted hover:text-red-600">Xoá</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
