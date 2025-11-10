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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const MIN_PASSWORD = 8;
const MIN_NAME = 2;


const updateUserForm = z.object({
  email: z.email("Email inválido").optional(),
  firstName: z.string().min(MIN_NAME, "Nome deve ter no mínimo 2 caracteres").optional().or(z.literal('')),
  lastName: z.string().min(MIN_NAME, "Sobrenome deve ter no mínimo 2 caracteres").optional().or(z.literal('')),
  password: z.string().min(MIN_PASSWORD, "Senha deve ter no mínimo 8 caracteres").optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  // Se senha foi preenchida, confirmPassword deve ser igual
  if (data.password && data.password.length > 0 && data.password !== "********") {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type UpdateUserForm = z.infer<typeof updateUserForm>

const studyGoalsSchema = z.object({
  area_of_interest: z.string().min(1, "Área de interesse é obrigatória").optional(),
  daily_flashcards_goal: z.number().min(1, "Mínimo de 1 flashcard").max(200, "Máximo de 200 flashcards").optional(),
  daily_quizzes_goal: z.number().min(1, "Mínimo de 1 quiz").max(100, "Máximo de 100 quizzes").optional(),
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

  // Separar nome completo em firstName e lastName
  const nameParts = profile?.user.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const { register: registerUser, handleSubmit: userHandleSubmit, formState: { isSubmitting: userSubmitting, errors: userError } } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserForm),
    values: {
      email: profile?.user.email,
      firstName: firstName,
      lastName: lastName,
    }
  })

  const { register: registerGoals, handleSubmit: studyHandleSubmt, setValue: setGoalValue, formState: { isSubmitting: studySubmitting, errors: studyError } } = useForm<UpdateStudyGoalsForm>({
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
      // Concatena firstName e lastName se foram fornecidos
      let fullName = undefined;
      if (data.firstName && data.lastName) {
        fullName = `${data.firstName} ${data.lastName}`;
      }

      // Não envia senha se for o placeholder

      await updateUser({
        email: data?.email,
        name: fullName,
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      type="text"
                      {...registerUser("firstName")}
                      placeholder="Ex: João"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      type="text"
                      {...registerUser("lastName")}
                      placeholder="Ex: Silva"
                    />
                  </div>
                </div>

                <Label htmlFor="password">Nova senha (deixe em branco para não alterar)</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerUser("password")}
                  placeholder="Digite uma nova senha"
                />

                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerUser("confirmPassword")}
                  placeholder="Confirme a nova senha"
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
              Atualizar Preferências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={studyHandleSubmt(handleGoalUpdate)}>
              <div className="space-y-3">
                <Label htmlFor="area_of_interest">
                  Área de interesse
                </Label>
                <Select
                  value={userGoals?.area_of_interest || ""}
                  onValueChange={(value) => setGoalValue("area_of_interest", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Exatas">Exatas</SelectItem>
                    <SelectItem value="Humanas">Humanas</SelectItem>
                    <SelectItem value="Idiomas">Idiomas</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>

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
