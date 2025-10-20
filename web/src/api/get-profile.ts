import { api } from "@/lib/axios";

export type GetProfileResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: "student" | "admin";
    is_first_access: boolean;
    created_at: string;
    updated_at: string | null;
  };
};

export async function getCurrentUser() {
  const response = await api.get<GetProfileResponse>("/me");
  return response.data;
}
