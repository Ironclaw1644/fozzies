import MenuRender from "@/components/menu/MenuRender";
import { getSettingValue } from "@/lib/settings";
import { buildMenuPdfPublicUrl, type MenuPdfSetting } from "@/lib/menuPdf";
import { getDefaultMenuPayload, parseMenuPayload } from "@/lib/menuSettings";
import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dinner Menu",
  description: "View the latest Fozzie's Dining menu, including seasonal chef selections and downloadable PDF menu.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Menu | Fozzie's Dining",
    description: "View the latest Fozzie's Dining menu, including seasonal chef selections and downloadable PDF menu.",
    url: "/menu",
    images: [
      {
        url: "/brand/logo_all_1_hq.png",
        alt: "Fozzie's Dining logo",
      },
    ],
  },
  twitter: {
    title: "Menu | Fozzie's Dining",
    description: "View the latest Fozzie's Dining menu, including seasonal chef selections and downloadable PDF menu.",
    images: ["/brand/logo_all_1_hq.png"],
  },
};

export default async function MenuPage() {
  const defaults = getDefaultMenuPayload();
  let menuMeta = defaults.meta;
  let menuSections = defaults.sections;
  let menuFooterBlock = defaults.footerBlock;
  let menuPdfPath = buildMenuPdfPublicUrl(null);

  const [storedMenu, storedPdf] = await Promise.all([
    getSettingValue<unknown>("menu_html"),
    getSettingValue<MenuPdfSetting>("menu_pdf"),
  ]);

  if (storedMenu == null) {
    menuMeta = defaults.meta;
    menuSections = defaults.sections;
  } else {
    const parsed = parseMenuPayload(storedMenu);
    if (parsed) {
      menuMeta = parsed.meta;
      menuSections = parsed.sections;
      menuFooterBlock = parsed.footerBlock || defaults.footerBlock;
    } else {
      console.error("Invalid site_settings.menu_html payload. Falling back to static menuData.");
    }
  }
  menuPdfPath = buildMenuPdfPublicUrl(storedPdf);

  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Fozzie's Dining Dinner Menu",
    url: `${SITE_URL}/menu`,
    inLanguage: "en-US",
    hasMenuSection: menuSections.map((section) => ({
      "@type": "MenuSection",
      name: section.title,
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.desc && item.desc.length > 0 ? { description: item.desc.join(", ") } : {}),
      })),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }} />
      <MenuRender menuMeta={menuMeta} menuSections={menuSections} footerBlock={menuFooterBlock} pdfUrl={menuPdfPath} />
    </>
  );
}
