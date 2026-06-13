"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/schemas";

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function signInAction(email: string, password: string): Promise<AuthResult> {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return { ok: false, error: "Invalid email or password." };
  }
  return { ok: true };
}

export async function resetPasswordAction(email: string): Promise<AuthResult> {
  const trimmed = email.trim();
  if (!trimmed) return { ok: false, error: "Enter your email address first." };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(trimmed);
  if (error) return { ok: false, error: "Could not send a reset email. Contact your administrator." };
  return { ok: true };
}
