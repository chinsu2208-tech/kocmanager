export type KOC = {
  id: string;
  name: string;
  handle: string;
  region: string;
  niche: string;
  followers: number;
  base_price_eur: number;
  avg_cvr: number | null;
  past_roi: number | null;
  rating: number | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  created_at: string;
};

export type CampaignStatus = "pending" | "confirmed" | "posted" | "completed" | "cancelled";

export type Campaign = {
  id: string;
  koc_id: string;
  product_id: string;
  campaign_name: string;
  budget_eur: number;
  post_url: string | null;
  status: CampaignStatus;
  start_date: string | null;
  created_at: string;
  koc?: KOC;
  product?: Product;
  performance_checkin?: PerformanceCheckin[];
};

export type PerformanceCheckin = {
  id: string;
  campaign_id: string;
  check_date: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  cvr: number | null;
  revenue_eur: number | null;
  notes: string | null;
  created_at: string;
};

export const STATUS_LABEL: Record<CampaignStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  posted: "Đã lên bài",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};

export const STATUS_COLOR: Record<CampaignStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  posted: "bg-violet-100 text-violet-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-200 text-gray-600",
};

export const REGIONS = ["Germany", "France", "UK", "Italy", "Spain", "Netherlands", "Poland", "Sweden", "Other"];
export const NICHES = ["Fashion", "Beauty", "Home", "Electronics", "Food", "Fitness", "Kids", "Lifestyle"];
export const CATEGORIES = ["Fashion", "Beauty", "Home", "Electronics", "Food", "Fitness", "Kids", "Other"];
