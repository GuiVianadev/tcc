import {
  Edit3,
  FileText,
  Globe,
  Lock,
  Plus,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Simulação do React Query para mutations
const useMutation = (mutationFn, options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await mutationFn(data);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        setError(err);
        options.onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, options]
  );

  return { mutate, isLoading, error };
};

// Mock API functions
const createDeck = async (deckData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Creating deck:", deckData);
  return { id: Math.random(), ...deckData };
};

const createCard = async (cardData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Creating card:", cardData);
  return { id: Math.random(), ...cardData };
};

// Componente para criar um card individual
const CardCreationForm = ({ onSave, onCancel, initialData = null, deckId }) => {
  const [cardData, setCardData] = useState({
    front: initialData?.front || "",
    back: initialData?.back || "",
    card_type: initialData?.card_type || "basic",
    tags: initialData?.tags || [],
    difficulty: initialData?.difficulty || "medium",
    estimated_time: initialData?.estimated_time || 30,
    deck_id: deckId,
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({});

  const validateCard = () => {
    const newErrors = {};

    if (!cardData.front.trim()) {
      newErrors.front = "O campo frente é obrigatório";
    }

    if (!cardData.back.trim()) {
      newErrors.back = "O campo verso é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateCard()) {
      onSave(cardData);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !cardData.tags.includes(newTag.trim())) {
      setCardData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setCardData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.name === "newTag") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          {initialData ? "Editar Card" : "Novo Card"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Frente do Card */}
        <div className="space-y-2">
          <Label htmlFor="front">Frente do Card</Label>
          <Textarea
            className={errors.front ? "border-red-500" : ""}
            id="front"
            onChange={(e) =>
              setCardData((prev) => ({ ...prev, front: e.target.value }))
            }
            placeholder="Digite a pergunta ou o que ficará na frente do card..."
            rows={3}
            value={cardData.front}
          />
          {errors.front && (
            <p className="text-red-600 text-sm">{errors.front}</p>
          )}
        </div>

        {/* Verso do Card */}
        <div className="space-y-2">
          <Label htmlFor="back">Verso do Card</Label>
          <Textarea
            className={errors.back ? "border-red-500" : ""}
            id="back"
            onChange={(e) =>
              setCardData((prev) => ({ ...prev, back: e.target.value }))
            }
            placeholder="Digite a resposta ou o que ficará no verso do card..."
            rows={4}
            value={cardData.back}
          />
          {errors.back && <p className="text-red-600 text-sm">{errors.back}</p>}
        </div>

        {/* Tipo do Card */}
        <div className="space-y-2">
          <Label>Tipo do Card</Label>
          <Select
            onValueChange={(value) =>
              setCardData((prev) => ({ ...prev, card_type: value }))
            }
            value={cardData.card_type}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Básico</SelectItem>
              <SelectItem value="cloze">Cloze (Lacuna)</SelectItem>
              <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dificuldade e Tempo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Dificuldade</Label>
            <Select
              onValueChange={(value) =>
                setCardData((prev) => ({ ...prev, difficulty: value }))
              }
              value={cardData.difficulty}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_time">Tempo Estimado (segundos)</Label>
            <Input
              id="estimated_time"
              max="300"
              min="10"
              onChange={(e) =>
                setCardData((prev) => ({
                  ...prev,
                  estimated_time: Number.parseInt(e.target.value) || 30,
                }))
              }
              type="number"
              value={cardData.estimated_time}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="mb-2 flex gap-2">
            <Input
              className="flex-1"
              name="newTag"
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma tag e pressione Enter"
              value={newTag}
            />
            <Button onClick={addTag} size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {cardData.tags.map((tag, index) => (
              <Badge
                className="flex items-center gap-1"
                key={index}
                variant="secondary"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-2 pt-4">
          <Button className="flex-1" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Card
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal de criação de deck
export function CreateDeck() {
  const [deckData, setDeckData] = useState({
    title: "",
    description: "",
    subject: "",
    tags: [],
    is_public: false,
    difficulty_level: "beginner",
    srs_settings: {
      new_cards_per_day: 20,
      max_reviews_per_day: 100,
      learning_steps: [1, 10],
      graduation_interval: 1,
      easy_interval: 4,
    },
  });

  const [cards, setCards] = useState([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({});
  const [createdDeckId, setCreatedDeckId] = useState(null);

  // Mutations
  const createDeckMutation = useMutation(createDeck, {
    onSuccess: (data) => {
      setCreatedDeckId(data.id);
      console.log("Deck criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar deck:", error);
    },
  });

  const createCardMutation = useMutation(createCard, {
    onSuccess: (data) => {
      console.log("Card criado com sucesso!");
    },
  });

  const validateDeck = () => {
    const newErrors = {};

    if (!deckData.title.trim()) {
      newErrors.title = "O título é obrigatório";
    } else if (deckData.title.trim().length < 3) {
      newErrors.title = "O título deve ter pelo menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDeck = async () => {
    if (!validateDeck()) return;

    try {
      const deck = await createDeckMutation.mutate(deckData);

      // Criar todos os cards
      if (cards.length > 0) {
        const cardPromises = cards.map((card) =>
          createCardMutation.mutate({ ...card, deck_id: deck.id })
        );
        await Promise.all(cardPromises);
      }

      // Aqui você poderia redirecionar para a página do deck criado
      alert(
        `Deck "${deck.title}" criado com sucesso com ${cards.length} cards!`
      );
    } catch (error) {
      console.error("Erro ao salvar deck:", error);
    }
  };

  const addDeckTag = () => {
    if (newTag.trim() && !deckData.tags.includes(newTag.trim())) {
      setDeckData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeDeckTag = (tagToRemove) => {
    setDeckData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSaveCard = (cardData) => {
    if (editingCard !== null) {
      // Editando card existente
      setCards((prev) =>
        prev.map((card, index) => (index === editingCard ? cardData : card))
      );
      setEditingCard(null);
    } else {
      // Adicionando novo card
      setCards((prev) => [...prev, cardData]);
    }
    setShowCardForm(false);
  };

  const handleEditCard = (index) => {
    setEditingCard(index);
    setShowCardForm(true);
  };

  const handleDeleteCard = (index) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.name === "deckTag") {
      e.preventDefault();
      addDeckTag();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl">Criar Novo Deck</h1>
          <p className="text-muted-foreground">
            Configure seu deck de estudos e adicione cards para começar a
            aprender
          </p>
        </div>

        {/* Informações do Deck */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações do Deck
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                className={errors.title ? "border-red-500" : ""}
                id="title"
                onChange={(e) =>
                  setDeckData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ex: Vocabulário de Inglês, Fórmulas de Física..."
                value={deckData.title}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                onChange={(e) =>
                  setDeckData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descreva o conteúdo e objetivos deste deck..."
                rows={3}
                value={deckData.description}
              />
            </div>

            {/* Matéria e Dificuldade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matéria/Assunto</Label>
                <Input
                  id="subject"
                  onChange={(e) =>
                    setDeckData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="Ex: Matemática, História, Programação..."
                  value={deckData.subject}
                />
              </div>

              <div className="space-y-2">
                <Label>Nível de Dificuldade</Label>
                <Select
                  onValueChange={(value) =>
                    setDeckData((prev) => ({
                      ...prev,
                      difficulty_level: value,
                    }))
                  }
                  value={deckData.difficulty_level}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="mb-2 flex gap-2">
                <Input
                  className="flex-1"
                  name="deckTag"
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite uma tag e pressione Enter"
                  value={newTag}
                />
                <Button onClick={addDeckTag} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {deckData.tags.map((tag, index) => (
                  <Badge
                    className="flex items-center gap-1"
                    key={index}
                    variant="secondary"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeDeckTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Configurações de Privacidade */}
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div className="flex items-center gap-3">
                {deckData.is_public ? (
                  <Globe className="h-5 w-5 text-green-600" />
                ) : (
                  <Lock className="h-5 w-5 text-orange-600" />
                )}
                <div>
                  <div className="font-medium">
                    {deckData.is_public ? "Deck Público" : "Deck Privado"}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {deckData.is_public
                      ? "Outras pessoas poderão encontrar e usar este deck"
                      : "Apenas você terá acesso a este deck"}
                  </div>
                </div>
              </div>
              <Switch
                checked={deckData.is_public}
                onCheckedChange={(checked) =>
                  setDeckData((prev) => ({ ...prev, is_public: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de SRS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de Repetição Espaçada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new_cards">Novos Cards por Dia</Label>
                <Input
                  id="new_cards"
                  max="100"
                  min="1"
                  onChange={(e) =>
                    setDeckData((prev) => ({
                      ...prev,
                      srs_settings: {
                        ...prev.srs_settings,
                        new_cards_per_day:
                          Number.parseInt(e.target.value) || 20,
                      },
                    }))
                  }
                  type="number"
                  value={deckData.srs_settings.new_cards_per_day}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_reviews">Máximo de Revisões por Dia</Label>
                <Input
                  id="max_reviews"
                  max="500"
                  min="10"
                  onChange={(e) =>
                    setDeckData((prev) => ({
                      ...prev,
                      srs_settings: {
                        ...prev.srs_settings,
                        max_reviews_per_day:
                          Number.parseInt(e.target.value) || 100,
                      },
                    }))
                  }
                  type="number"
                  value={deckData.srs_settings.max_reviews_per_day}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Seção de Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-xl">Cards do Deck</h2>
              <p className="text-muted-foreground text-sm">
                {cards.length}{" "}
                {cards.length === 1 ? "card adicionado" : "cards adicionados"}
              </p>
            </div>
            <Button
              disabled={showCardForm}
              onClick={() => setShowCardForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Card
            </Button>
          </div>

          {/* Formulário de Card */}
          {showCardForm && (
            <CardCreationForm
              deckId={createdDeckId}
              initialData={editingCard !== null ? cards[editingCard] : null}
              onCancel={() => {
                setShowCardForm(false);
                setEditingCard(null);
              }}
              onSave={handleSaveCard}
            />
          )}

          {/* Lista de Cards */}
          {cards.length > 0 && (
            <div className="space-y-2">
              {cards.map((card, index) => (
                <Card className="border-l-4 border-l-blue-500" key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="font-medium text-muted-foreground text-sm">
                          Card {index + 1}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-sm">Frente:</div>
                            <div className="rounded bg-muted p-2 text-sm">
                              {card.front.length > 100
                                ? `${card.front.substring(0, 100)}...`
                                : card.front}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-sm">Verso:</div>
                            <div className="rounded bg-muted p-2 text-sm">
                              {card.back.length > 100
                                ? `${card.back.substring(0, 100)}...`
                                : card.back}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{card.card_type}</Badge>
                          <Badge variant="outline">{card.difficulty}</Badge>
                          {card.tags.map((tag) => (
                            <Badge
                              className="text-xs"
                              key={tag}
                              variant="secondary"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <Button
                          onClick={() => handleEditCard(index)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCard(index)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {cards.length === 0 && !showCardForm && (
            <Alert>
              <AlertDescription>
                Nenhum card adicionado ainda. Clique em "Adicionar Card" para
                começar.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Botão de Salvar Deck */}
        <div className="flex justify-end border-t pt-6">
          <Button
            className="min-w-[200px]"
            disabled={createDeckMutation.isLoading || !deckData.title.trim()}
            onClick={handleSaveDeck}
            size="lg"
          >
            {createDeckMutation.isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Criar Deck
              </>
            )}
          </Button>
        </div>

        {createDeckMutation.error && (
          <Alert variant="destructive">
            <AlertDescription>
              Erro ao criar deck. Tente novamente.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
