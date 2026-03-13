import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSettingValue, upsertSettingValue } from "@/lib/settings";
import { buildMenuPdfPublicUrl, MENU_PDF_BUCKET, MENU_PDF_STORAGE_PREFIX, normalizeMenuPdfSetting, type MenuPdfSetting } from "@/lib/menuPdf";
import { logServerEvent } from "@/lib/trackServer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ ok: false, error: "Only PDF files are allowed" }, { status: 400 });
    }

    const previousValue = await getSettingValue<MenuPdfSetting>("menu_pdf");
    const previousSetting = normalizeMenuPdfSetting(previousValue);
    const now = new Date().toISOString();
    const storagePath = `${MENU_PDF_STORAGE_PREFIX}/menu-${Date.now()}.pdf`;
    const supabase = supabaseAdmin();
    const { error: uploadError } = await supabase.storage.from(MENU_PDF_BUCKET).upload(storagePath, file, {
      upsert: false,
      contentType: "application/pdf",
    });

    if (uploadError) {
      if (/bucket/i.test(uploadError.message) && /not found|does not exist/i.test(uploadError.message)) {
        return NextResponse.json(
          {
            ok: false,
            error: `Supabase Storage bucket \`${MENU_PDF_BUCKET}\` is missing. Create it in Supabase Storage and make it public before uploading.`,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: false, error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const setting: MenuPdfSetting = {
      originalFileName: file.name,
      original_file_name: file.name,
      storagePath,
      storage_path: storagePath,
      updatedAt: now,
      updated_at: now,
    };
    const { error: settingError } = await upsertSettingValue("menu_pdf", setting);
    if (settingError) {
      return NextResponse.json({ ok: false, error: `Failed to save setting: ${settingError.message}` }, { status: 500 });
    }

    if (previousSetting.storagePath && previousSetting.storagePath !== storagePath) {
      await supabase.storage.from(MENU_PDF_BUCKET).remove([previousSetting.storagePath]);
    }

    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    revalidatePath("/admin/menu-pdf");

    await logServerEvent({
      event_type: "admin_pdf_upload",
      page_path: "/admin/menu-pdf",
      user_agent: req.headers.get("user-agent"),
      referrer: req.headers.get("referer"),
      meta: { file_name: file.name, storage_path: storagePath },
    });
    return NextResponse.json({
      ok: true,
      storagePath: setting.storagePath,
      publicUrl: buildMenuPdfPublicUrl(setting),
      updatedAt: setting.updatedAt,
      fileName: file.name,
      provider: "supabase-storage",
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "Upload failed while writing menu PDF to Supabase Storage.",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
