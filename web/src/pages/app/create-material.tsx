import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMaterialFromTopic, useCreateMaterialFromFile } from "@/hooks/use-materials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const topicSchema = z.object({
  title: z.string().min(3, "Mínimo de 3 caracteres").max(200, "Máximo de 200 caracteres"),
  topic: z.string().min(3, "Mínimo de 3 caracteres").max(500, "Máximo de 500 caracteres"),
  flashcardsQuantity: z.coerce.number().min(5, "Mínimo 5").max(20, "Máximo 20").optional(),
  quizzesQuantity: z.coerce.number().min(3, "Mínimo 3").max(15, "Máximo 15").optional(),
});

const fileSchema = z.object({
  title: z.string().min(3, "Mínimo de 3 caracteres").max(200, "Máximo de 200 caracteres"),
  flashcardsQuantity: z.coerce.number().min(5, "Mínimo 5").max(20, "Máximo 20").optional(),
  quizzesQuantity: z.coerce.number().min(3, "Mínimo 3").max(15, "Máximo 15").optional(),
});

type TopicForm = z.infer<typeof topicSchema>;
type FileForm = z.infer<typeof fileSchema>;

/**
 * Página de criação de material
 *
 * Oferece 3 formas de criar material:
 * 1. A partir de um tópico/prompt (IA gera tudo)
 * 2. A partir de um arquivo (PDF, DOCX, TXT, PNG, JPG)
 *
 * A IA gera automaticamente:
 * - Conteúdo do material
 * - Resumo
 * - Flashcards (quantidade configurável)
 * - Quizzes (quantidade configurável)
 */
export function CreateMaterial() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { mutateAsync: createFromTopic, isPending: isCreatingFromTopic } =
    useCreateMaterialFromTopic();
  const { mutateAsync: createFromFile, isPending: isCreatingFromFile } =
    useCreateMaterialFromFile();

  const topicForm = useForm<TopicForm>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      flashcardsQuantity: 10,
      quizzesQuantity: 5,
    },
  });

  const fileForm = useForm<FileForm>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      flashcardsQuantity: 10,
      quizzesQuantity: 5,
    },
  });

  async function handleCreateFromTopic(data: TopicForm) {
    try {
      await createFromTopic(data);
      navigate("/materials");
    } catch (error: any) {
      topicForm.setError("root", {
        message: error?.response?.data?.message || "Erro ao criar material",
      });
    }
  }

  async function handleCreateFromFile(data: FileForm) {
    if (!selectedFile) {
      fileForm.setError("root", { message: "Selecione um arquivo" });
      return;
    }

    try {
      await createFromFile({
        ...data,
        file: selectedFile,
      });
      navigate("/materials");
    } catch (error: any) {
      fileForm.setError("root", {
        message: error?.response?.data?.message || "Erro ao criar material",
      });
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  const topicErrors = Object.values(topicForm.formState.errors)
    .map((error) => error?.message)
    .filter(Boolean);

  const fileErrors = Object.values(fileForm.formState.errors)
    .map((error) => error?.message)
    .filter(Boolean);

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Criar Novo Material</h1>
        <p className="text-muted-foreground">
          Escolha como deseja criar seu material de estudo
        </p>
      </div>

      <Tabs defaultValue="topic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topic">A partir de Tópico</TabsTrigger>
          <TabsTrigger value="file">Upload de Arquivo</TabsTrigger>
        </TabsList>

        {/* Tab: Tópico */}
        <TabsContent value="topic">
          <Card>
            <CardHeader>
              <CardTitle>Criar a partir de Tópico</CardTitle>
              <CardDescription>
                A IA irá gerar conteúdo completo, resumo, flashcards e quizzes automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={topicForm.handleSubmit(handleCreateFromTopic)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="topic-title">Título do Material</Label>
                  <Input
                    id="topic-title"
                    {...topicForm.register("title")}
                    placeholder="Ex: Introdução ao React"
                  />
                </div>

                <div>
                  <Label htmlFor="topic">Tópico ou Prompt</Label>
                  <Textarea
                    id="topic"
                    {...topicForm.register("topic")}
                    placeholder="Descreva o que você quer estudar. Ex: Conceitos básicos de React, incluindo componentes, props e state"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topic-flashcards">Quantidade de Flashcards</Label>
                    <Input
                      id="topic-flashcards"
                      type="number"
                      min={5}
                      max={20}
                      {...topicForm.register("flashcardsQuantity")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic-quizzes">Quantidade de Quizzes</Label>
                    <Input
                      id="topic-quizzes"
                      type="number"
                      min={3}
                      max={15}
                      {...topicForm.register("quizzesQuantity")}
                    />
                  </div>
                </div>

                {topicErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-inside list-disc">
                        {topicErrors.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/materials")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingFromTopic}
                    className="bg-blue-800 hover:bg-blue-700"
                  >
                    {isCreatingFromTopic ? "Gerando material..." : "Criar Material"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Arquivo */}
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Arquivo</CardTitle>
              <CardDescription>
                Envie um PDF, DOCX, TXT, PNG ou JPG (máx 10MB). A IA extrairá o conteúdo e gerará
                flashcards e quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={fileForm.handleSubmit(handleCreateFromFile)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="file-title">Título do Material</Label>
                  <Input
                    id="file-title"
                    {...fileForm.register("title")}
                    placeholder="Ex: Apostila de JavaScript"
                  />
                </div>

                {/* Drag & Drop Area */}
                <div>
                  <Label>Arquivo</Label>
                  <div
                    className={`mt-2 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    {selectedFile ? (
                      <div className="text-center">
                        <svg
                          className="mx-auto mb-2 h-12 w-12 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="link"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                        >
                          Remover arquivo
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg
                          className="mx-auto mb-2 h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-1 font-medium">
                          Arraste um arquivo ou clique para selecionar
                        </p>
                        <p className="text-muted-foreground text-sm">
                          PDF, DOCX, TXT, PNG, JPG (máx 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="file-flashcards">Quantidade de Flashcards</Label>
                    <Input
                      id="file-flashcards"
                      type="number"
                      min={5}
                      max={20}
                      {...fileForm.register("flashcardsQuantity")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="file-quizzes">Quantidade de Quizzes</Label>
                    <Input
                      id="file-quizzes"
                      type="number"
                      min={3}
                      max={15}
                      {...fileForm.register("quizzesQuantity")}
                    />
                  </div>
                </div>

                {fileErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-inside list-disc">
                        {fileErrors.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/materials")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingFromFile}
                    className="bg-blue-800 hover:bg-blue-700"
                  >
                    {isCreatingFromFile ? "Processando arquivo..." : "Criar Material"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}