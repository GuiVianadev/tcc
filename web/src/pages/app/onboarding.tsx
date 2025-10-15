import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/use-user";
import { useUpsertStudyGoals } from "@/hooks/use-study-goals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const studyGoalsSchema = z.object({
  area_of_interest: z.string().min(1, "Área de interesse é obrigatória"),
  daily_flashcards_goal: z.coerce.number().min(1, "Mínimo de 1 flashcard").max(200, "Máximo de 200 flashcards"),
  daily_quizzes_goal: z.coerce.number().min(1, "Mínimo de 1 quiz").max(100, "Máximo de 100 quizzes"),
});

type StudyGoalsForm = z.infer<typeof studyGoalsSchema>;

/**
 * Página de onboarding para primeiro acesso
 *
 * Coleta metas de estudo do usuário:
 * - Área de interesse
 * - Meta diária de flashcards
 * - Meta diária de quizzes
 *
 * Após conclusão, marca is_first_access = false e redireciona para dashboard.
 */
export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { mutateAsync: upsertGoals } = useUpsertStudyGoals();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudyGoalsForm>({
    resolver: zodResolver(studyGoalsSchema),
    defaultValues: {
      area_of_interest: "",
      daily_flashcards_goal: 20,
      daily_quizzes_goal: 10,
    },
  });

  async function handleCompleteOnboarding(data: StudyGoalsForm) {
    try {
      // Salvar metas de estudo
      await upsertGoals(data);

      // Marca onboarding como completo
      await updateProfile({ is_first_access: false });

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao completar onboarding:", error);
    }
  }

  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Bem-vindo ao CognitioAI!</CardTitle>
          <CardDescription>
            Vamos configurar sua experiência de estudos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleCompleteOnboarding)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Olá, {user?.name}!</h3>
                <p className="text-muted-foreground text-sm">
                  Configure suas metas de estudo para uma experiência personalizada.
                </p>
              </div>

              {/* Área de interesse */}
              <div className="space-y-2">
                <Label htmlFor="area_of_interest">
                  Área de interesse
                </Label>
                <Input
                  id="area_of_interest"
                  {...register("area_of_interest")}
                  placeholder="Ex: Programação, Matemática, Inglês..."
                />
                <p className="text-muted-foreground text-xs">
                  Qual área você está estudando?
                </p>
              </div>

              {/* Meta diária de flashcards */}
              <div className="space-y-2">
                <Label htmlFor="daily_flashcards_goal">
                  Meta diária de flashcards
                </Label>
                <Input
                  id="daily_flashcards_goal"
                  type="number"
                  min={1}
                  max={200}
                  {...register("daily_flashcards_goal")}
                  placeholder="20"
                />
                <p className="text-muted-foreground text-xs">
                  Quantos flashcards você deseja revisar por dia?
                </p>
              </div>

              {/* Meta diária de quizzes */}
              <div className="space-y-2">
                <Label htmlFor="daily_quizzes_goal">
                  Meta diária de quizzes
                </Label>
                <Input
                  id="daily_quizzes_goal"
                  type="number"
                  min={1}
                  max={100}
                  {...register("daily_quizzes_goal")}
                  placeholder="10"
                />
                <p className="text-muted-foreground text-xs">
                  Quantos quizzes você deseja completar por dia?
                </p>
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

              {/* Botão */}
              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-800 hover:bg-blue-700"
                >
                  {isSubmitting ? "Salvando..." : "Começar a usar"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}