# Keychain Vault

Build a polished desktop-first password manager UI prototype named “Keychain” for a Windows/macOS-style desktop application window. The user explicitly wants an Apple-inspired white UI: minimal, premium, calm, precise spacing, SF Pro-like system typography, subtle borders, restrained blue accents, soft neutral grays, no gradients, no dark theme, no glassmorphism, no oversized marketing elements. Design for a 1440×900 desktop window first, but make it responsive at smaller window sizes and laptops; no horizontal page overflow. The app should look like a real desktop productivity app, not a website landing page.

SCOPE: UI screens only, using safe dummy sample data. Do NOT connect a database, Supabase, cloud sync, external auth, or deploy. Do NOT store real credentials. Use in-memory demo state only and clearly treat displayed account examples as sample data. The app must be a front-end prototype with working navigation and interactions.

APP FLOW / SCREENS:
1) On first open, show a focused “Unlock Vault” authentication screen inside a desktop-app-style window. Include small app mark, Keychain wordmark, Master Password input with show/hide, Unlock Vault button, subtle “Your vault is stored securely on this device” placeholder text (do not claim actual encryption is implemented), and a small Help icon. Unlock can be simulated with any non-empty input for prototype purposes, with a gentle validation message if empty. After unlock, open Dashboard. Add Lock Vault action to return to unlock screen.
2) Main application shell: fixed-width left sidebar (collapsible or responsive), top content header, elegant white canvas. Sidebar: Keychain logo/title, Dashboard, section label ACCOUNTS, Google Accounts, Other Email Accounts, Social Media, Other Website Logins, Settings at bottom, plus a clear “+ Add Account” primary button. Use appropriate recognizable service icons where available and simple fallback icons. Selected nav item has a subtle light-blue/gray background. Avoid extra sections such as notes, cards, passkeys, favorites, password history, etc.
3) Dashboard: title “Dashboard”, a compact search field, a clear “Add Account” action, small summary card for total saved accounts, and four category cards/rows showing counts: Google Accounts, Other Email Accounts, Social Media, Other Website Logins. Include a compact “Recently added” list with sample accounts. Counts derive from demo state and update when accounts are added/deleted.
4) Category screens: separate screens for Google Accounts, Other Email Accounts, Social Media, and Other Website Logins. Show heading, account count, search/filter input, and an Add Account action. Show all saved accounts of that category on the same page; multiple Gmail/Google accounts must appear together on the Google Accounts page, not on separate pages. For each saved login, create a clean rectangular credential card inspired by the supplied Google Password Manager screenshot layout: provider/domain and account name on the left; on the right a neatly grouped credential area with Username/Email and Password rows. Password is hidden by default. Each row has its own Copy icon; password row has Show/Hide and Copy. Put Edit and Delete actions at the bottom/right of each card. No Note field. Cards should stack vertically and page should scroll naturally for many accounts. Make content compact and avoid huge empty blocks.
5) Add Account screen / view: a dedicated, clean form. First section “Select Platform” must be a compact single horizontal row of small rectangular selectable chips/cards, left-to-right (not a tall grid, not stacked). At narrower widths, keep this row horizontally scrollable rather than wrapping into a tall column. Options should cover Google, Other Email (with provider choices such as Outlook, Yahoo, iCloud, Other), Instagram, TikTok, Facebook, Snapchat, X, LinkedIn, and Other Website. Group/category is automatically determined from selected platform. Then show fields: Account Name (this is the ONE display/profile name field; do not create a separate Profile Name field), Username / Email, Password. Do not add Notes. Do not add redundant profile fields. Include Show/Hide password, a “Generate Password” control which generates a random strong demo password using crypto.getRandomValues where supported (never Math.random), and Save Account / Cancel. For Other Website, allow a Website Name/domain field only if needed to identify that website, but keep the main Account Name field as the single user-facing account label. Make it easy to create multiple accounts on the same platform (e.g. two or more Gmail accounts).
6) Account row behavior: Copy Username/Email and Copy Password actions should work with clipboard where browser permissions allow and show a subtle toast/confirmation. Show/Hide password toggle works. Edit opens the same form prefilled and updates the selected item. Delete asks for confirmation, then removes the item in demo state. Add creates a new demo record in memory and returns to its category list. Search filters the current list. Use accessible labels and keyboard focus states.
7) Settings screen: keep minimal, with Master Password settings placeholder, Auto-Lock selector, Appearance showing Light selected (UI only), and Lock Vault. Do not overbuild settings.

DESIGN DETAILS:
- Desktop app proportions: sidebar around 240–260px; main content constrained comfortably with 32–40px padding; forms/card content not stretched across the entire 1440 width.
- Use a premium Apple-like system font stack (SF Pro if available, otherwise -apple-system, BlinkMacSystemFont, “Segoe UI”, sans-serif). Typography hierarchy subtle and crisp. Body text medium-small, headings restrained, consistent 8px spacing scale.
- White backgrounds, light neutral separators (#E7E7EA-ish), near-black text, secondary gray, restrained blue for primary actions and active states. Border radius 10–14px, gentle shadows only when useful. Icons consistent line style.
- Make all desktop screens visually consistent. Build a coherent complete UI, not just a dashboard mockup.
- Use sensible demo sample records (e.g. Personal Gmail, Work Gmail, Instagram, TikTok, Outlook, portfolio website) with obviously fictitious/example emails and placeholder hidden passwords; do not use the user's real personal credentials.
- Ensure the unlock screen, dashboard, all four category pages, add/edit account form, and settings are all accessible and interactive.
- Keep the scope strictly limited to login credentials as listed above. No secure notes, credit cards, identities, passkeys, favorites, history, backup/restore, billing, or unrelated features.

Implement as a clean TypeScript + React + Tailwind app in the default Lovable project stack. Prioritize visual quality and reliable interactions over backend functionality.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/36465849-c64a-4144-b6da-fa0cda52acfa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
