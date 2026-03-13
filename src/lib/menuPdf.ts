import "server-only";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const MENU_PDF_BUCKET = "public-assets";
export const MENU_PDF_STORAGE_PREFIX = "menu";

export type MenuPdfSetting = {
  originalFileName?: string;
  original_file_name?: string;
  storagePath?: string;
  storage_path?: string;
  path?: string;
  updatedAt?: string;
  updated_at?: string;
};

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function extractLegacyStoragePath(pathOrUrl: string) {
  if (!pathOrUrl) return "";

  try {
    const url = new URL(pathOrUrl);
    const marker = `/storage/v1/object/public/${MENU_PDF_BUCKET}/`;
    const index = url.pathname.indexOf(marker);
    if (index >= 0) {
      return decodeURIComponent(url.pathname.slice(index + marker.length));
    }
    return "";
  } catch {
    return /^https?:\/\//i.test(pathOrUrl) ? "" : pathOrUrl.replace(/^\/+/, "");
  }
}

function withCacheBust(url: string, version?: string) {
  if (!url || !version) return url;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("v", version);
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${encodeURIComponent(version)}`;
  }
}

export function normalizeMenuPdfSetting(value: unknown): MenuPdfSetting {
  if (!value || typeof value !== "object") {
    return {};
  }

  const row = value as Record<string, unknown>;
  const originalFileName = readString(row.originalFileName) || readString(row.original_file_name) || readString(row.fileName);
  const updatedAt = readString(row.updatedAt) || readString(row.updated_at);
  const storagePath = readString(row.storagePath) || readString(row.storage_path) || extractLegacyStoragePath(readString(row.path));

  return {
    originalFileName: originalFileName || undefined,
    original_file_name: originalFileName || undefined,
    storagePath: storagePath || undefined,
    storage_path: storagePath || undefined,
    updatedAt: updatedAt || undefined,
    updated_at: updatedAt || undefined,
  };
}

export function getMenuPdfDisplayName(value: unknown) {
  const setting = normalizeMenuPdfSetting(value);
  if (setting.originalFileName) return setting.originalFileName;

  const legacyPath = value && typeof value === "object" ? readString((value as Record<string, unknown>).path) : "";
  const source = legacyPath || setting.storagePath || "";
  const fileName = source.split("?")[0]?.split("#")[0]?.split("/").pop();

  return fileName || "menu.pdf";
}

export function buildMenuPdfPublicUrl(value: unknown) {
  const setting = normalizeMenuPdfSetting(value);
  if (!setting.storagePath) return "";
  const { data } = supabaseAdmin().storage.from(MENU_PDF_BUCKET).getPublicUrl(setting.storagePath);

  return withCacheBust(data.publicUrl || "", setting.updatedAt);
}
