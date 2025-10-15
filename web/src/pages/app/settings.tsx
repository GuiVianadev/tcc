import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/users";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/api/get-profile";
import { getStudyGoals, updateStudyGoals } from "@/api/study-goals";


const MIN_PASSWORD = 8;
const MIN_USERNAME = 3;


const updateUserForm = z.object({
  email: z.email("Email inválido").optional(),
  name: z.string().min(MIN_USERNAME, "Mínimo 3 caracteres").optional(),
  password: z.string().min(MIN_PASSWORD, "Mínimo 8 caracteres").optional(),
});
type UpdateUserForm = z.infer<typeof updateUserForm>

const studyGoalsSchema = z.object({
  area_of_interest: z.string().min(1, "Área de interesse é obrigatória").optional(),
  daily_flashcards_goal: z.coerce.number().min(1, "Mínimo de 1 flashcard").max(200, "Máximo de 200 flashcards").optional(),
  daily_quizzes_goal: z.coerce.number().min(1, "Mínimo de 1 quiz").max(100, "Máximo de 100 quizzes").optional(),
});

type UpdateStudyGoalsForm = z.infer<typeof studyGoalsSchema>;


export function Settings() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentUser,
  });
  const { data: userGoals } = useQuery({
    queryKey: ["studyGoals"],
    queryFn: getStudyGoals,
  });

  const { register: registerUser, handleSubmit: userHandleSubmit, formState: { isSubmitting: userSubmitting, errors: userError } } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserForm),
    values: {
      email: profile?.user.email,
      name: profile?.user.name,
      password: "********"
    }
  })

  const { register: registerGoals, handleSubmit: studyHandleSubmt, formState: { isSubmitting: studySubmitting, errors: studyError } } = useForm<UpdateStudyGoalsForm>({
    resolver: zodResolver(studyGoalsSchema),
    values: {
      area_of_interest: userGoals?.area_of_interest,
      daily_flashcards_goal: userGoals?.daily_flashcards_goal,
      daily_quizzes_goal: userGoals?.daily_quizzes_goal
    }
  })


  const { mutateAsync: updateUser } = useMutation({
    mutationFn: updateUserProfile,
  })
  const { mutateAsync: updateGoal } = useMutation({
    mutationFn: updateStudyGoals,
  })

  async function handleUserUpdate(data: UpdateUserForm) {
    try {
      await updateUser({
        email: data?.email,
        name: data?.name,
        password: data?.password
      })
    }
    catch (error) {
      console.error("Erro ao atualizar o usuario", error)
    }
  }
  async function handleGoalUpdate(data: UpdateStudyGoalsForm) {
    try {
      await updateGoal({
        area_of_interest: data?.area_of_interest,
        daily_flashcards_goal: data?.daily_flashcards_goal,
        daily_quizzes_goal: data?.daily_quizzes_goal
      })
    }
    catch (error) {
      console.error("Erro ao atualizar o usuario", error)
    }
  }
  const userErrorMessages = Object.values(userError)
    .map((error) => error?.message)
    .filter(Boolean);

  const studyErrorMessages = Object.values(studyError)
    .map((error) => error?.message)
    .filter(Boolean);

  return (
    <div className="container mx-auto p-6">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Configurações</h1>
          <p className="text-muted-foreground">
            Altere opções da conta e preferências do aplicativo.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Card >
          <CardHeader>
            <CardTitle>
              Atualizar Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={userHandleSubmit(handleUserUpdate)}>
              <div className="space-y-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerUser("email")}
                  placeholder="Atualize seu email"
                />
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  {...registerUser("name")}
                  placeholder="Atualize seu nome"
                />
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerUser("password")}
                  placeholder="Atualize sua senha"
                />
              </div>

              {userErrorMessages.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-inside list-disc space-y-1">
                      {userErrorMessages.map((message, index) => (
                        <li key={index}>{message}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="bg-foreground"
                disabled={userSubmitting}
                type="submit"
              >
                Atualizar Perfil
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card >
          <CardHeader>
            <CardTitle>
              Atualizar Preferencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={studyHandleSubmt(handleGoalUpdate)}>
              <div className="space-y-3">
                <Label htmlFor="area_of_interest">
                  Área de interesse
                </Label>
                <Input
                  id="area_of_interest"
                  {...registerGoals("area_of_interest")}
                  placeholder="Ex: Programação, Matemática, Inglês..."
                />

                <Label htmlFor="daily_flashcards_goal">
                  Meta diária de flashcards
                </Label>
                <Input
                  id="daily_flashcards_goal"
                  type="number"
                  min={1}
                  max={200}
                  {...registerGoals("daily_flashcards_goal")}
                  placeholder="20"
                />

                <Label htmlFor="daily_quizzes_goal">
                  Meta diária de quizzes
                </Label>
                <Input
                  id="daily_quizzes_goal"
                  type="number"
                  min={1}
                  max={100}
                  {...registerGoals("daily_quizzes_goal")}
                  placeholder="10"
                />
              </div>

              {studyErrorMessages.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-inside list-disc space-y-1">
                      {studyErrorMessages.map((message, index) => (
                        <li key={index}>{message}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="bg-foreground"
                disabled={studySubmitting}
                type="submit"
              >
                Atualizar Metas
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
