import { api } from "@/lib/axios";

export type GetProfileResponse = {
  user: {
    name: string;
    email: string;
    role: "student" | "admin";
    is_first_access: boolean;
    created_at: Date;
    updated_at: Date | null;
  };
};

export async function getCurrentUser() {
  const response = await api.get<GetProfileResponse>("/me");
  return response.data;
}
