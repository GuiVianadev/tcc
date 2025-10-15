import { api } from "@/lib/axios";

export type SignInBody = {
  email: string;
  password: string;
};

export type SignInResponse = {
  token: string;
};

export async function signIn({ email, password }: SignInBody) {
  const response = await api.post<SignInResponse>("/users/login", {
    email,
    password,
  });

  localStorage.setItem("@cognitio:token", response.data.token);

  return response.data;
}
