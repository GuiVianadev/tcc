import { api } from "@/lib/axios";

export type SignUpBody = {
  email: string;
  fullname: string;
  username: string;
  password: string;
};

export async function signUp({
  email,
  fullname,
  username,
  password,
}: SignUpBody) {
  await api.post("/api/v1/auth/register", {
    email,
    fullname,
    username,
    password,
  });
}
