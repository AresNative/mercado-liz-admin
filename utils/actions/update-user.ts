"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type FormDataEntry = {
  email: string;
};

export async function updateUser(formData: FormData) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const userData: FormDataEntry = {
    email: formData.get("email") as string,
  };

  // Simular actualización en base de datos
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Revalidar caché específica
  revalidateTag("user-data");

  return { success: true, message: "Usuario actualizado" };
}
