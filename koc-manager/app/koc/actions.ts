"use server";

import { getSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createKoc(formData: FormData) {
  const supabase = getSupabase();
  const payload = {
    name: String(formData.get("name") || "").trim(),
    handle: String(formData.get("handle") || "").trim(),
    region: String(formData.get("region") || "Other"),
    niche: String(formData.get("niche") || "Lifestyle"),
    followers: Number(formData.get("followers") || 0),
    base_price_eur: Number(formData.get("base_price_eur") || 0),
  };
  if (!payload.name || !payload.handle) return;

  const { error } = await supabase.from("koc").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/koc");
}

export async function deleteKoc(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("koc").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/koc");
}
