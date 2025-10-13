import { api } from "@/lib/axios";

export type SignUpBody = {
  email: string;
  name: string;
  username: string;
  password: string;
};

export async function signUp({ email, name, username, password }: SignUpBody) {
  await api.post("/users/register", {
    email,
    name,
    username,
    password,
  });
}
