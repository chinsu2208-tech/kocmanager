"use server";

import { getSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCampaign(formData: FormData) {
  const supabase = getSupabase();

  const koc_id = String(formData.get("koc_id") || "");
  const product_name = String(formData.get("product_name") || "").trim();
  const category = String(formData.get("category") || "Other");
  const campaign_name = String(formData.get("campaign_name") || "").trim();
  const budget_eur = Number(formData.get("budget_eur") || 0);
  const start_date = String(formData.get("start_date") || "") || null;

  if (!koc_id || !product_name || !campaign_name) return;

  // Tìm sản phẩm theo tên, chưa có thì tạo mới
  const { data: existing } = await supabase.from("product").select("id").ilike("name", product_name).limit(1).maybeSingle();
  let product_id = existing?.id;
  if (!product_id) {
    const { data: created, error: prodErr } = await supabase
      .from("product")
      .insert({ name: product_name, category })
      .select("id")
      .single();
    if (prodErr) throw new Error(prodErr.message);
    product_id = created.id;
  }

  const { error } = await supabase.from("campaign").insert({
    koc_id,
    product_id,
    campaign_name,
    budget_eur,
    start_date,
    status: "pending",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/campaigns");
  revalidatePath("/");
}

export async function updateCampaignStatus(id: string, status: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("campaign").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${id}`);
  revalidatePath("/");
}

export async function updatePostUrl(id: string, formData: FormData) {
  const supabase = getSupabase();
  const post_url = String(formData.get("post_url") || "").trim();
  const { error } = await supabase.from("campaign").update({ post_url }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/campaigns/${id}`);
}

export async function addCheckin(campaign_id: string, formData: FormData) {
  const supabase = getSupabase();
  const payload = {
    campaign_id,
    check_date: String(formData.get("check_date") || "") || new Date().toISOString().slice(0, 10),
    views: numOrNull(formData.get("views")),
    likes: numOrNull(formData.get("likes")),
    comments: numOrNull(formData.get("comments")),
    shares: numOrNull(formData.get("shares")),
    cvr: numOrNull(formData.get("cvr")),
    revenue_eur: numOrNull(formData.get("revenue_eur")),
    notes: String(formData.get("notes") || "").trim() || null,
  };
  const { error } = await supabase.from("performance_checkin").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath(`/campaigns/${campaign_id}`);
  revalidatePath("/");
}

function numOrNull(v: FormDataEntryValue | null) {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
