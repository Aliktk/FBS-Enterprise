import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GALLERY_BUCKET } from "@/lib/constants";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File exceeds 10MB." }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Use JPG, PNG, WebP or AVIF." }, { status: 400 });

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

  const { error } = await supabase.storage.from(GALLERY_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
