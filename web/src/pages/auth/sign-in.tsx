import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IconLogo from "../../assets/icon-logo.svg?react"


const signInForm = z.object({
  email: z.email("Email inválido"),
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

      if (user.is_first_access) {
        navigate("/onboarding");
      } else if (user.role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/app");
      }
    } catch (error: any) {
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
    <div className="p-8 w-[460px]">
      <div className="flex  flex-col justify-center gap-6 pb-6">
        <div className="flex gap-2 font-semibold justify-between items-center">
          <div>
            <h1 className="font-bold text-2xl text-white">Fazer login</h1>
            <span className="font-light text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                className="font-semibold text-orange-400 hover:text-orange-300"
                to={"/sign-up"}
              >
                Fazer registro
              </Link>
            </span>
          </div>
          <IconLogo className="h-8 w-8" />
        </div>
      </div>
      <form
        className="flex flex-col gap-6 text-white"
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
          variant={"cognitio"}
          disabled={isSubmitting}
          type="submit"
        >
          Acessar conta
        </Button>
      </form>
    </div>
  );
}
