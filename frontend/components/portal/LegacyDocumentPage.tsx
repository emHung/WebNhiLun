import { PortalShell } from "./shared";
import { privacyContent, termsContent } from "./legacy-doc-content";

export function LegacyDocumentPage({ page }: { page: "privacy" | "terms" }) {
  const content = page === "privacy" ? privacyContent : termsContent;
  return (
    <PortalShell>
      <main
        className="container"
        style={{ paddingTop: 30, paddingBottom: 50, maxWidth: 800 }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </PortalShell>
  );
}
