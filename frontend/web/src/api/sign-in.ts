import { api } from "@/lib/axios";

export type SignInBody = {
  email: string;
  password: string;
};

export async function signIn({ email, password }: SignInBody) {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/api/v1/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}
