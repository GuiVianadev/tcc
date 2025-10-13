import { api } from "@/lib/axios";

export async function logout() {
  await api.post("/users/logout");

  // Remove o token do localStorage
  localStorage.removeItem("@cognitio:token");
}
