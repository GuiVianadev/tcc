import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signInForm = z.object({
  email: z.email(),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  });

  async function handleSignIn(data: SignInForm) {
    try {
      const user = await signIn(data.email, data.password);

      // Redireciona baseado em primeiro acesso
      if (user.is_first_access) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      // Define erro no formulário
      if (error?.response?.status === 401) {
        setError("root", {
          type: "manual",
          message: "Credenciais inválidas",
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Erro ao fazer login. Tente novamente.",
        });
      }
    }
  }

  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean);

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

        {/* Erros */}
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
          Acessar conta
        </Button>
      </form>
    </div>
  );
}
