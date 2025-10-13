import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const studyGoalsSchema = z.object({
  daily_goal_minutes: z.coerce.number().min(15, "Mínimo de 15 minutos").max(480, "Máximo de 8 horas"),
  study_days_per_week: z.coerce.number().min(1, "Mínimo de 1 dia").max(7, "Máximo de 7 dias"),
  preferred_study_time: z.enum(["morning", "afternoon", "evening", "night"]),
});

type StudyGoalsForm = z.infer<typeof studyGoalsSchema>;

/**
 * Página de onboarding para primeiro acesso
 *
 * Coleta preferências de estudo do usuário:
 * - Meta diária de estudo (minutos)
 * - Dias de estudo por semana
 * - Horário preferido de estudo
 *
 * Após conclusão, marca is_first_access = false e redireciona para dashboard.
 */
export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<StudyGoalsForm>({
    resolver: zodResolver(studyGoalsSchema),
    defaultValues: {
      daily_goal_minutes: 60,
      study_days_per_week: 5,
      preferred_study_time: "evening",
    },
  });

  const preferredStudyTime = watch("preferred_study_time");

  async function handleCompleteOnboarding(data: StudyGoalsForm) {
    try {
      // TODO: Salvar study goals no backend (criar endpoint)
      console.log("Study goals:", data);

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

              {/* Meta diária */}
              <div className="space-y-2">
                <Label htmlFor="daily_goal_minutes">
                  Meta diária de estudo (minutos)
                </Label>
                <Input
                  id="daily_goal_minutes"
                  type="number"
                  min={15}
                  max={480}
                  {...register("daily_goal_minutes")}
                  placeholder="60"
                />
                <p className="text-muted-foreground text-xs">
                  Quanto tempo você pretende estudar por dia?
                </p>
              </div>

              {/* Dias por semana */}
              <div className="space-y-2">
                <Label htmlFor="study_days_per_week">
                  Dias de estudo por semana
                </Label>
                <Input
                  id="study_days_per_week"
                  type="number"
                  min={1}
                  max={7}
                  {...register("study_days_per_week")}
                  placeholder="5"
                />
                <p className="text-muted-foreground text-xs">
                  Quantos dias por semana você planeja estudar?
                </p>
              </div>

              {/* Horário preferido */}
              <div className="space-y-2">
                <Label htmlFor="preferred_study_time">
                  Horário preferido de estudo
                </Label>
                <Select
                  value={preferredStudyTime}
                  onValueChange={(value) =>
                    setValue("preferred_study_time", value as StudyGoalsForm["preferred_study_time"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Manhã (6h - 12h)</SelectItem>
                    <SelectItem value="afternoon">Tarde (12h - 18h)</SelectItem>
                    <SelectItem value="evening">Noite (18h - 22h)</SelectItem>
                    <SelectItem value="night">Madrugada (22h - 6h)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                  Quando você costuma estudar melhor?
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