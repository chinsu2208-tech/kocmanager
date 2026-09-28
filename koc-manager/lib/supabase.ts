import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Dùng chung một client cho cả server components và server actions.
// MVP dùng anon key + policy "allow all" (xem supabase/schema.sql) vì chưa có đăng nhập nhiều người.
export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Xem README.md để biết cách lấy 2 giá trị này từ Supabase Dashboard."
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
