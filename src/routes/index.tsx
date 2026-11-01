import { createFileRoute } from "@tanstack/react-router";
import { Keychain } from "@/components/keychain/Keychain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Keychain — Password Manager" },
      { name: "description", content: "Keychain: a calm, minimal desktop password manager prototype." },
      { property: "og:title", content: "Keychain — Password Manager" },
      { property: "og:description", content: "A calm, minimal desktop password manager prototype." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Keychain,
});
