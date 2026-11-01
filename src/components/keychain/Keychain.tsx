import { useMemo, useState, type ReactNode } from "react";
import { toast, Toaster } from "sonner";
import {
  Eye, EyeOff, Copy, Pencil, Trash2, Plus, Search, LayoutGrid, Settings, Lock,
  HelpCircle, Mail, AtSign, Users, Globe, KeyRound, PanelLeft, Wand2, ChevronRight,
} from "lucide-react";
import {
  CATEGORIES, PLATFORMS, SAMPLE_ACCOUNTS, generatePassword, getPlatform,
  type Account, type Category, type PlatformId,
} from "@/lib/vault";

type View =
  | { name: "dashboard" }
  | { name: "category"; category: Category }
  | { name: "form"; editId?: string; category?: Category }
  | { name: "settings" };

const CAT_ICON: Record<Category, typeof Mail> = { google: Mail, email: AtSign, social: Users, web: Globe };

const catOf = (a: Account) => getPlatform(a.platform).category;

async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Clipboard not available in this window");
  }
}

/* ---------- small primitives ---------- */

function Mark({ platform, size = "md" }: { platform: PlatformId; size?: "sm" | "md" }) {
  const p = getPlatform(platform);
  const s = size === "sm" ? "h-6 w-6 text-[10px] rounded-md" : "h-9 w-9 text-xs rounded-[10px]";
  return (
    <span className={`${s} ${p.tone} inline-flex shrink-0 items-center justify-center font-semibold text-primary-foreground`} aria-hidden>
      {p.mark}
    </span>
  );
}

function Btn({ variant = "primary", children, className = "", ...rest }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "border border-input bg-background text-foreground hover:bg-secondary",
    ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  }[variant];
  return (
    <button {...rest} className={`inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[13px] font-medium transition-colors disabled:opacity-50 ${v} ${className}`}>
      {children}
    </button>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
      {children}
    </button>
  );
}

function SearchField({ value, onChange, placeholder = "Search" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="relative block w-full max-w-64">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="h-8 w-full rounded-lg border border-input bg-muted pl-8 pr-3 text-[13px] placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

const inputCls = "h-9 w-full rounded-lg border border-input bg-background px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-ring";

/* ---------- unlock ---------- */

function Unlock({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className="relative flex h-full items-center justify-center bg-background p-6">
      <button aria-label="Help" title="Help" onClick={() => toast("Prototype: enter any text to unlock the demo vault.")}
        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
        <HelpCircle className="h-4 w-4" />
      </button>
      <form className="w-full max-w-[320px] text-center"
        onSubmit={(e) => { e.preventDefault(); if (!pw.trim()) { setErr("Enter your master password to continue."); return; } onUnlock(); }}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <KeyRound className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Keychain</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Enter your master password to unlock.</p>
        <div className="mt-6 text-left">
          <label htmlFor="mp" className="mb-1.5 block text-xs font-medium text-muted-foreground">Master Password</label>
          <div className="relative">
            <input id="mp" autoFocus type={show ? "text" : "password"} value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(""); }}
              aria-invalid={!!err} aria-describedby={err ? "mp-err" : undefined}
              className={`${inputCls} pr-9`} />
            <span className="absolute right-1 top-1/2 -translate-y-1/2">
              <IconBtn label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </IconBtn>
            </span>
          </div>
          {err && <p id="mp-err" className="mt-1.5 text-xs text-destructive">{err}</p>}
        </div>
        <Btn type="submit" className="mt-4 h-9 w-full">Unlock Vault</Btn>
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" /> Your vault is stored securely on this device
        </p>
      </form>
    </div>
  );
}

/* ---------- sidebar ---------- */

function Sidebar({ view, go, counts, collapsed }: { view: View; go: (v: View) => void; counts: Record<Category, number>; collapsed: boolean }) {
  const item = (active: boolean, label: string, Icon: typeof Mail, onClick: () => void, count?: number) => (
    <button onClick={onClick} title={collapsed ? label : undefined} aria-current={active ? "page" : undefined}
      className={`flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors ${active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-secondary"} ${collapsed ? "justify-center px-0" : ""}`}>
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.75} />
      {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
      {!collapsed && count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
    </button>
  );
  return (
    <aside className={`flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-3 transition-[width] ${collapsed ? "w-16" : "w-60"}`}>
      <div className={`mb-4 flex items-center gap-2 px-1.5 pt-1 ${collapsed ? "justify-center" : ""}`}>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"><KeyRound className="h-4 w-4" /></span>
        {!collapsed && <span className="text-[15px] font-semibold tracking-tight">Keychain</span>}
      </div>
      <Btn onClick={() => go({ name: "form" })} className={`mb-4 ${collapsed ? "w-10 px-0 self-center" : "w-full"}`} aria-label="Add Account">
        <Plus className="h-4 w-4" />{!collapsed && "Add Account"}
      </Btn>
      <nav className="flex flex-1 flex-col gap-0.5" aria-label="Main">
        {item(view.name === "dashboard", "Dashboard", LayoutGrid, () => go({ name: "dashboard" }))}
        {!collapsed ? <p className="mb-1 mt-4 px-2.5 text-[11px] font-medium tracking-wide text-muted-foreground">ACCOUNTS</p> : <div className="my-2 border-t border-sidebar-border" />}
        {CATEGORIES.map((c) => item(view.name === "category" && view.category === c.id, c.label, CAT_ICON[c.id], () => go({ name: "category", category: c.id }), counts[c.id]))}
      </nav>
      <div className="border-t border-sidebar-border pt-2">
        {item(view.name === "settings", "Settings", Settings, () => go({ name: "settings" }))}
      </div>
    </aside>
  );
}

/* ---------- header ---------- */

function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

const matches = (a: Account, q: string) => {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const p = getPlatform(a.platform);
  return [a.name, a.username, a.website, p.label, p.domain].some((x) => x?.toLowerCase().includes(s));
};

/* ---------- dashboard ---------- */

function Dashboard({ accounts, counts, go }: { accounts: Account[]; counts: Record<Category, number>; go: (v: View) => void }) {
  const [q, setQ] = useState("");
  const recent = [...accounts].sort((a, b) => b.createdAt - a.createdAt).filter((a) => matches(a, q)).slice(0, q ? 20 : 5);
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Sample data · prototype vault">
        <SearchField value={q} onChange={setQ} placeholder="Search all accounts" />
        <Btn onClick={() => go({ name: "form" })}><Plus className="h-4 w-4" />Add Account</Btn>
      </PageHeader>
      <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Total saved accounts</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{accounts.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">across 4 categories</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICON[c.id];
            return (
              <button key={c.id} onClick={() => go({ name: "category", category: c.id })}
                className="group flex items-center gap-3 rounded-xl border border-border p-3.5 text-left transition-colors hover:bg-muted">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon className="h-4 w-4" strokeWidth={1.75} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{c.label}</span>
                  <span className="text-xs text-muted-foreground">{counts[c.id]} {counts[c.id] === 1 ? "account" : "accounts"}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            );
          })}
        </div>
      </div>
      <section className="mt-8">
        <h2 className="mb-2 text-[13px] font-semibold">{q ? "Search results" : "Recently added"}</h2>
        <div className="divide-y divide-border rounded-xl border border-border">
          {recent.length === 0 && <p className="p-4 text-[13px] text-muted-foreground">No matching accounts.</p>}
          {recent.map((a) => (
            <button key={a.id} onClick={() => go({ name: "category", category: catOf(a) })}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted">
              <Mark platform={a.platform} size="sm" />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{a.name}</span>
              <span className="hidden truncate text-xs text-muted-foreground sm:block">{a.username}</span>
              <span className="w-28 shrink-0 text-right text-xs text-muted-foreground">{CATEGORIES.find((c) => c.id === catOf(a))!.short}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------- credential card ---------- */

function CredentialCard({ a, onEdit, onDelete }: { a: Account; onEdit: () => void; onDelete: () => void }) {
  const [show, setShow] = useState(false);
  const p = getPlatform(a.platform);
  const domain = a.website || p.domain;
  const row = (label: string, value: ReactNode, actions: ReactNode) => (
    <div className="flex items-center gap-3 px-3 py-2">
      <span className="w-32 shrink-0 whitespace-nowrap text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-[13px]">{value}</span>
      <span className="flex shrink-0 items-center">{actions}</span>
    </div>
  );
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex min-w-0 items-center gap-3 md:w-56 md:shrink-0">
          <Mark platform={a.platform} />
          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-medium">{a.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{domain}</p>
          </div>
        </div>
        <div className="min-w-0 flex-1 divide-y divide-border rounded-lg border border-border bg-muted">
          {row("Username / Email", <span className="font-sans">{a.username}</span>,
            <IconBtn label={`Copy username for ${a.name}`} onClick={() => copyText(a.username, "Username")}><Copy className="h-3.5 w-3.5" /></IconBtn>)}
          {row("Password", show ? a.password : "••••••••••••", <>
            <IconBtn label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)}>
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </IconBtn>
            <IconBtn label={`Copy password for ${a.name}`} onClick={() => copyText(a.password, "Password")}><Copy className="h-3.5 w-3.5" /></IconBtn>
          </>)}
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-1">
        <Btn variant="ghost" className="h-7 px-2 text-xs" onClick={onEdit}><Pencil className="h-3.5 w-3.5" />Edit</Btn>
        <Btn variant="ghost" className="h-7 px-2 text-xs hover:text-destructive" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" />Delete</Btn>
      </div>
    </article>
  );
}

function CategoryPage({ category, accounts, go, onDelete }: { category: Category; accounts: Account[]; go: (v: View) => void; onDelete: (a: Account) => void }) {
  const [q, setQ] = useState("");
  const c = CATEGORIES.find((x) => x.id === category)!;
  const list = accounts.filter((a) => catOf(a) === category);
  const shown = list.filter((a) => matches(a, q));
  return (
    <>
      <PageHeader title={c.label} subtitle={`${list.length} ${list.length === 1 ? "account" : "accounts"}`}>
        <SearchField value={q} onChange={setQ} placeholder={`Search ${c.short.toLowerCase()}`} />
        <Btn onClick={() => go({ name: "form", category })}><Plus className="h-4 w-4" />Add Account</Btn>
      </PageHeader>
      <div className="flex flex-col gap-3">
        {shown.map((a) => <CredentialCard key={a.id} a={a} onEdit={() => go({ name: "form", editId: a.id })} onDelete={() => onDelete(a)} />)}
        {shown.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
            {list.length ? "No accounts match your search." : "No accounts saved yet."}
          </div>
        )}
      </div>
    </>
  );
}

/* ---------- form ---------- */

const CHIP_IDS: PlatformId[] = ["google", "otheremail", "instagram", "tiktok", "facebook", "snapchat", "x", "linkedin", "web"];
const EMAIL_PROVIDERS: PlatformId[] = ["outlook", "yahoo", "icloud", "otheremail"];
const defaultFor: Record<Category, PlatformId> = { google: "google", email: "outlook", social: "instagram", web: "web" };

function AccountForm({ initial, category, onSave, onCancel }: { initial?: Account | undefined; category?: Category | undefined; onSave: (a: Omit<Account, "id" | "createdAt">) => void; onCancel: () => void }) {
  const [platform, setPlatform] = useState<PlatformId>(initial?.platform ?? (category ? defaultFor[category] : "google"));
  const [name, setName] = useState(initial?.name ?? "");
  const [username, setUsername] = useState(initial?.username ?? "");
  const [password, setPassword] = useState(initial?.password ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const p = getPlatform(platform);
  const isEmail = p.category === "email";
  const chipActive = (id: PlatformId) => (id === "otheremail" ? isEmail : id === platform);

  const gen = () => {
    try { setPassword(generatePassword()); setShow(true); toast.success("Strong password generated"); }
    catch { toast.error("Secure random generator isn't supported here"); }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!name.trim()) er['name'] = "Account name is required.";
    if (!username.trim()) er['username'] = "Username or email is required.";
    if (!password) er['password'] = "Password is required.";
    if (platform === "web" && !website.trim()) er['website'] = "Website is required.";
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave({ platform, name: name.trim(), username: username.trim(), password, website: platform === "web" ? website.trim() : undefined });
  };

  const field = (id: string, label: string, el: ReactNode) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {el}
      {errors[id] && <p className="mt-1 text-xs text-destructive">{errors[id]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} className="max-w-[640px]" noValidate>
      <PageHeader title={initial ? "Edit Account" : "Add Account"} subtitle={`Saves to ${CATEGORIES.find((c) => c.id === p.category)!.label}`} />
      <section className="mb-6">
        <h2 className="mb-2 text-[13px] font-semibold">Select Platform</h2>
        <div role="radiogroup" aria-label="Platform" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
          {CHIP_IDS.map((id) => {
            const cp = getPlatform(id);
            const active = chipActive(id);
            return (
              <button key={id} type="button" role="radio" aria-checked={active}
                onClick={() => setPlatform(id === "otheremail" ? (isEmail ? platform : "outlook") : id)}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-[13px] transition-colors ${active ? "border-primary bg-accent font-medium text-accent-foreground" : "border-border hover:bg-muted"}`}>
                <Mark platform={id} size="sm" />{cp.label}
              </button>
            );
          })}
        </div>
        {isEmail && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-muted-foreground">Provider</span>
            {EMAIL_PROVIDERS.map((id) => (
              <button key={id} type="button" aria-pressed={platform === id} onClick={() => setPlatform(id)}
                className={`h-7 rounded-full border px-3 text-xs transition-colors ${platform === id ? "border-primary bg-accent text-accent-foreground" : "border-border hover:bg-muted"}`}>
                {id === "otheremail" ? "Other" : getPlatform(id).label}
              </button>
            ))}
          </div>
        )}
      </section>
      <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
        {platform === "web" && field("website", "Website", <input id="website" className={inputCls} placeholder="example.com" value={website} onChange={(e) => setWebsite(e.target.value)} />)}
        {field("name", "Account Name", <input id="name" className={inputCls} placeholder={platform === "google" ? "e.g. Work Gmail" : `e.g. Personal ${p.label}`} value={name} onChange={(e) => setName(e.target.value)} />)}
        {field("username", "Username / Email", <input id="username" className={inputCls} placeholder="name@example.com" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)} />)}
        {field("password", "Password", (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input id="password" type={show ? "text" : "password"} autoComplete="new-password" className={`${inputCls} pr-9 font-mono`} value={password} onChange={(e) => setPassword(e.target.value)} />
              <span className="absolute right-1 top-1/2 -translate-y-1/2">
                <IconBtn label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </IconBtn>
              </span>
            </div>
            <Btn type="button" variant="secondary" className="h-9" onClick={gen}><Wand2 className="h-3.5 w-3.5" />Generate Password</Btn>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Btn type="button" variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit">Save Account</Btn>
      </div>
    </form>
  );
}

/* ---------- settings ---------- */

function SettingsPage({ onLock }: { onLock: () => void }) {
  const [auto, setAuto] = useState("15");
  const row = (title: string, desc: string, control: ReactNode) => (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
      <div><p className="text-[13px] font-medium">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      {control}
    </div>
  );
  return (
    <div className="max-w-[640px]">
      <PageHeader title="Settings" />
      <div className="divide-y divide-border rounded-xl border border-border">
        {row("Master Password", "Change the password used to unlock your vault.",
          <Btn variant="secondary" onClick={() => toast("Not available in this prototype")}>Change…</Btn>)}
        {row("Auto-Lock", "Lock the vault after a period of inactivity.", (
          <select aria-label="Auto-Lock" value={auto} onChange={(e) => setAuto(e.target.value)} className="h-8 rounded-lg border border-input bg-background px-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="1">After 1 minute</option><option value="5">After 5 minutes</option>
            <option value="15">After 15 minutes</option><option value="60">After 1 hour</option><option value="never">Never</option>
          </select>
        ))}
        {row("Appearance", "Keychain uses the light appearance.", (
          <div role="radiogroup" aria-label="Appearance" className="flex rounded-lg border border-input p-0.5">
            <span role="radio" aria-checked className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">Light</span>
          </div>
        ))}
        {row("Lock Vault", "Require the master password again.", <Btn variant="secondary" onClick={onLock}><Lock className="h-3.5 w-3.5" />Lock Vault</Btn>)}
      </div>
    </div>
  );
}

/* ---------- confirm dialog ---------- */

function Confirm({ account, onCancel, onConfirm }: { account: Account; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4" onClick={onCancel}>
      <div role="alertdialog" aria-modal aria-labelledby="del-t" onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onCancel()} className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-window">
        <h2 id="del-t" className="text-[15px] font-semibold">Delete “{account.name}”?</h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground">This removes the login from your vault. This can't be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="secondary" autoFocus onClick={onCancel}>Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- app ---------- */

export function Keychain() {
  const [unlocked, setUnlocked] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(SAMPLE_ACCOUNTS);
  const [view, setView] = useState<View>({ name: "dashboard" });
  const [collapsed, setCollapsed] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Account | null>(null);

  const counts = useMemo(() => {
    const c: Record<Category, number> = { google: 0, email: 0, social: 0, web: 0 };
    accounts.forEach((a) => c[catOf(a)]++);
    return c;
  }, [accounts]);

  const lock = () => { setUnlocked(false); setView({ name: "dashboard" }); };
  const editing = view.name === "form" && view.editId ? accounts.find((a) => a.id === view.editId) : undefined;
  const crumb = view.name === "dashboard" ? "Dashboard" : view.name === "settings" ? "Settings"
    : view.name === "category" ? CATEGORIES.find((c) => c.id === view.category)!.label : editing ? "Edit Account" : "Add Account";

  return (
    <div className="flex h-screen items-center justify-center bg-secondary p-0 lg:p-6">
      <Toaster position="bottom-center" toastOptions={{ className: "!text-[13px] !rounded-xl" }} />
      <div className="flex h-full w-full max-w-[1440px] flex-col overflow-hidden bg-background lg:max-h-[900px] lg:rounded-xl lg:border lg:border-border lg:shadow-window">
        {/* title bar */}
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-border px-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-3 rounded-full border border-border bg-secondary" /><span className="h-3 w-3 rounded-full border border-border bg-secondary" /><span className="h-3 w-3 rounded-full border border-border bg-secondary" />
          </div>
          <span className="flex-1 text-center text-xs font-medium text-muted-foreground">Keychain</span>
          <span className="w-12" />
        </div>
        {!unlocked ? <div className="min-h-0 flex-1"><Unlock onUnlock={() => setUnlocked(true)} /></div> : (
          <div className="flex min-h-0 flex-1">
            <Sidebar view={view} go={setView} counts={counts} collapsed={collapsed} />
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
                <IconBtn label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)}><PanelLeft className="h-4 w-4" /></IconBtn>
                <span className="flex-1 truncate text-[13px] text-muted-foreground">{crumb}</span>
                <Btn variant="ghost" onClick={lock}><Lock className="h-3.5 w-3.5" />Lock Vault</Btn>
              </header>
              <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <div className="mx-auto max-w-[960px] px-5 py-8 md:px-10">
                  {view.name === "dashboard" && <Dashboard accounts={accounts} counts={counts} go={setView} />}
                  {view.name === "category" && <CategoryPage key={view.category} category={view.category} accounts={accounts} go={setView} onDelete={setPendingDelete} />}
                  {view.name === "settings" && <SettingsPage onLock={lock} />}
                  {view.name === "form" && (
                    <AccountForm key={view.editId ?? "new"} initial={editing} category={view.category}
                      onCancel={() => setView(editing ? { name: "category", category: catOf(editing) } : view.category ? { name: "category", category: view.category } : { name: "dashboard" })}
                      onSave={(data) => {
                        if (editing) {
                          setAccounts((xs) => xs.map((x) => (x.id === editing.id ? { ...x, ...data } : x)));
                          toast.success("Account updated");
                        } else {
                          setAccounts((xs) => [...xs, { ...data, id: crypto.randomUUID(), createdAt: Date.now() }]);
                          toast.success("Account saved");
                        }
                        setView({ name: "category", category: getPlatform(data.platform).category });
                      }} />
                  )}
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
      {pendingDelete && (
        <Confirm account={pendingDelete} onCancel={() => setPendingDelete(null)}
          onConfirm={() => { setAccounts((xs) => xs.filter((x) => x.id !== pendingDelete.id)); setPendingDelete(null); toast("Account deleted"); }} />
      )}
    </div>
  );
}
