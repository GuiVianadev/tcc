import { api } from "@/lib/axios";

export type SignUpBody = {
  email: string;
  name: string;
  password: string;
};

export async function signUp({ email, name, password }: SignUpBody) {
  await api.post("/users/register", {
    email,
    name,
    password,
  });
}
