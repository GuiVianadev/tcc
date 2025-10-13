import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { signUp } from "@/api/sign-up";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MIN_PASSWORD = 8;
const MIN_USERNAME = 3;

const signUpForm = z.object({
  email: z.email("Email inválido"),
  name: z.string().min(MIN_USERNAME, "Mínimo 3 caracteres"),
  password: z.string().min(MIN_PASSWORD, "Mínimo 8 caracteres"),
});

type SignUpForm = z.infer<typeof signUpForm>;

export function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  });

  const { mutateAsync: registerAccount } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate("/sign-in");
    },
  });

  async function handleSignUp(data: SignUpForm) {
    try {
      await registerAccount({
        email: data.email,
        name: data.name,
        password: data.password,
      });
    } catch (error) {
      console.error("Erro ao registrar:", error);
    }
  }

  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean);

  return (
    <div className="p-8">
      <div className="flex w-[350px] flex-col justify-center gap-6 pb-6">
        <div className="flex flex-col gap-2 font-semibold">
          <h1 className="font-bold text-2xl">Criar conta</h1>
          <span className="font-light text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              className="font-semibold text-blue-800 hover:text-blue-700"
              to={"/sign-in"}
            >
              Fazer login
            </Link>
          </span>
        </div>
      </div>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(handleSignUp)}
      >
        <div className="space-y-3">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Digite seu email"
          />
          <Label htmlFor="fullname">Nome completo</Label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Digite seu nome completo"
          />
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Deve ter no mínimo 8 caracteres"
          />
        </div>

        {errorMessages.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-inside list-disc space-y-1">
                {errorMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Button
          className="bg-blue-800 hover:bg-blue-700"
          disabled={isSubmitting}
          type="submit"
        >
          Finalizar cadastro
        </Button>
      </form>
    </div>
  );
}
