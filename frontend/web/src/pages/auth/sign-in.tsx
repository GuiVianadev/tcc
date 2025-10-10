import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { signIn } from "@/api/sign-in";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MIN_PASSWORD = 8;

const signInForm = z.object({
  email: z.email(),
  password: z.string().min(MIN_PASSWORD),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  });

  const {
    mutateAsync: authenticate,
    error: apiError,
    isError,
  } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate("/");
    },
  });

  async function handleSignIn(data: SignInForm) {
    await authenticate({ email: data.email, password: data.password });
  }

  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean);
  const is401Error = (apiError as any)?.status === 401;

  return (
    <div className="p-8">
      <div className="flex w-[350px] flex-col justify-center gap-6 pb-6">
        <div className="flex flex-col gap-2 font-semibold">
          <h1 className="font-bold text-2xl">Bem vindo de volta</h1>
          <span className="font-light text-muted-foreground">
            Não tem uma conta?{" "}
            <Link
              className="font-semibold text-blue-800 hover:text-blue-700"
              to={"/sign-up"}
            >
              Criar conta
            </Link>
          </span>
        </div>
      </div>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <div className="space-y-3">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Digite seu email"
          />
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Digite sua senha"
          />
        </div>

        {/* Erros de validação */}
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

        {isError && is401Error && (
          <Alert variant="destructive">
            <AlertDescription>Credenciais inválidas</AlertDescription>
          </Alert>
        )}

        {isError && !is401Error && (
          <Alert variant="destructive">
            <AlertDescription>Erro ao fazer login</AlertDescription>
          </Alert>
        )}

        <Button
          className="bg-blue-800 hover:bg-blue-700"
          disabled={isSubmitting}
          type="submit"
        >
          Acessar conta
        </Button>
      </form>
    </div>
  );
}
