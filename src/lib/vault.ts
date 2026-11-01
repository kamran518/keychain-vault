export type Category = "google" | "email" | "social" | "web";

export type PlatformId =
  | "google" | "outlook" | "yahoo" | "icloud" | "otheremail"
  | "instagram" | "tiktok" | "facebook" | "snapchat" | "x" | "linkedin"
  | "web";

export interface Platform {
  id: PlatformId;
  label: string;
  domain: string;
  category: Category;
  mark: string;
  tone: string; // tailwind class using brand tokens
}

export const PLATFORMS: Platform[] = [
  { id: "google", label: "Google", domain: "accounts.google.com", category: "google", mark: "G", tone: "bg-brand-google" },
  { id: "outlook", label: "Outlook", domain: "outlook.com", category: "email", mark: "O", tone: "bg-brand-outlook" },
  { id: "yahoo", label: "Yahoo", domain: "mail.yahoo.com", category: "email", mark: "Y", tone: "bg-brand-yahoo" },
  { id: "icloud", label: "iCloud", domain: "icloud.com", category: "email", mark: "i", tone: "bg-brand-icloud" },
  { id: "otheremail", label: "Other Email", domain: "mail", category: "email", mark: "@", tone: "bg-brand-neutral" },
  { id: "instagram", label: "Instagram", domain: "instagram.com", category: "social", mark: "Ig", tone: "bg-brand-instagram" },
  { id: "tiktok", label: "TikTok", domain: "tiktok.com", category: "social", mark: "Tt", tone: "bg-brand-ink" },
  { id: "facebook", label: "Facebook", domain: "facebook.com", category: "social", mark: "f", tone: "bg-brand-facebook" },
  { id: "snapchat", label: "Snapchat", domain: "snapchat.com", category: "social", mark: "S", tone: "bg-brand-snapchat" },
  { id: "x", label: "X", domain: "x.com", category: "social", mark: "X", tone: "bg-brand-ink" },
  { id: "linkedin", label: "LinkedIn", domain: "linkedin.com", category: "social", mark: "in", tone: "bg-brand-linkedin" },
  { id: "web", label: "Other Website", domain: "", category: "web", mark: "W", tone: "bg-brand-neutral" },
];

export const getPlatform = (id: PlatformId) => PLATFORMS.find((p) => p.id === id)!;

export const CATEGORIES: { id: Category; label: string; short: string }[] = [
  { id: "google", label: "Google Accounts", short: "Google" },
  { id: "email", label: "Other Email Accounts", short: "Email" },
  { id: "social", label: "Social Media", short: "Social" },
  { id: "web", label: "Other Website Logins", short: "Websites" },
];

export interface Account {
  id: string;
  platform: PlatformId;
  name: string;
  username: string;
  password: string;
  website?: string | undefined;
  createdAt: number;
}

const t = Date.now();
export const SAMPLE_ACCOUNTS: Account[] = [
  { id: "1", platform: "google", name: "Personal Gmail", username: "alex.sample@example.com", password: "Demo-Pass-1!", createdAt: t - 9e8 },
  { id: "2", platform: "google", name: "Work Gmail", username: "alex.work@example.com", password: "Demo-Pass-2!", createdAt: t - 7e8 },
  { id: "3", platform: "outlook", name: "Outlook", username: "alex.demo@example.net", password: "Demo-Pass-3!", createdAt: t - 5e8 },
  { id: "4", platform: "instagram", name: "Instagram", username: "@alex.example", password: "Demo-Pass-4!", createdAt: t - 3e8 },
  { id: "5", platform: "tiktok", name: "TikTok", username: "@alex_demo", password: "Demo-Pass-5!", createdAt: t - 2e8 },
  { id: "6", platform: "web", name: "Portfolio Website", website: "portfolio.example.com", username: "admin@example.com", password: "Demo-Pass-6!", createdAt: t - 1e8 },
];

export function generatePassword(length = 20): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+";
  const c = globalThis.crypto;
  if (!c?.getRandomValues) throw new Error("Secure random generator unavailable");
  const out: string[] = [];
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / chars.length) * chars.length;
  while (out.length < length) {
    c.getRandomValues(buf);
    const v = buf[0] ?? limit;
    if (v < limit) out.push(chars.charAt(v % chars.length));
  }
  return out.join("");
}
