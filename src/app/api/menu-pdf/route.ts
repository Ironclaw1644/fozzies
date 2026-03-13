import { NextResponse } from "next/server";
import { getSettingValue } from "@/lib/settings";
import { buildMenuPdfPublicUrl, normalizeMenuPdfSetting, type MenuPdfSetting } from "@/lib/menuPdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const value = await getSettingValue<MenuPdfSetting>("menu_pdf");
  const setting = normalizeMenuPdfSetting(value);
  const url = buildMenuPdfPublicUrl(value);

  return NextResponse.json(
    {
      ok: !!url,
      url,
      storagePath: setting.storagePath || null,
      updatedAt: setting.updatedAt || null,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
