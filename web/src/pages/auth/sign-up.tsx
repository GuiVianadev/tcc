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
const MIN_NAME = 2;

const signUpForm = z.object({
  email: z.email("Email inválido"),
  firstName: z.string().min(MIN_NAME, "Nome deve ter no mínimo 2 caracteres"),
  lastName: z.string().min(MIN_NAME, "Sobrenome deve ter no mínimo 2 caracteres"),
  password: z.string().min(MIN_PASSWORD, "Senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(MIN_PASSWORD, "Confirmação de senha obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
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
      // Concatena firstName e lastName para enviar como name
      const fullName = `${data.firstName} ${data.lastName}`;

      await registerAccount({
        email: data.email,
        name: fullName,
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                type="text"
                {...register("firstName")}
                placeholder="Ex: João"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                type="text"
                {...register("lastName")}
                placeholder="Ex: Silva"
              />
            </div>
          </div>

          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Mínimo 8 caracteres"
          />

          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder="Digite a senha novamente"
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
