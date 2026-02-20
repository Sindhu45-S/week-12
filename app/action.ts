"use server";

import { revalidatePath } from "next/cache";
import { taskSchema } from "@/lib/schema";
import { supabase } from "@/lib/supabase";

export async function addTask(formData: FormData) {
  const title = formData.get("title");

  const parsed = taskSchema.safeParse({ title });
  if (!parsed.success) throw new Error("Invalid input");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("tasks").insert({
    title,
    user_id: user?.id,
  });

  revalidatePath("/dashboard");
}

export async function toggleTask(id: string, is_completed: boolean) {
  await supabase
    .from("tasks")
    .update({ is_completed: !is_completed })
    .eq("id", id);

  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/dashboard");
}
