import { useState } from "react";
import { Plus, Target, Calendar, CheckCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStudyGoals, useCreateStudyGoal, useUpdateStudyGoal, useDeleteStudyGoal } from "@/api/queries/dashboard";

export function StudyGoals() {
  const { data: goals, isLoading, error } = useStudyGoals();
  const createGoal = useCreateStudyGoal();
  const updateGoal = useUpdateStudyGoal();
  const deleteGoal = useDeleteStudyGoal();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-4">
            Erro ao carregar metas
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma meta definida
            </h3>
            <p className="text-gray-500 mb-4">
              Crie suas primeiras metas de estudo para acompanhar seu progresso
            </p>
            <CreateGoalDialog 
              isOpen={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              onCreateGoal={createGoal.mutate}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas de Estudo
          </CardTitle>
          <CreateGoalDialog 
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onCreateGoal={createGoal.mutate}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.current_cards, goal.target_cards);
            const daysRemaining = getDaysRemaining(goal.target_date);
            const isOverdue = daysRemaining < 0;
            const isCompleted = goal.is_completed || progress >= 100;

            return (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={isCompleted ? "default" : isOverdue ? "destructive" : "secondary"}>
                        {isCompleted ? "Concluída" : isOverdue ? "Atrasada" : "Em andamento"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {goal.current_cards} / {goal.target_cards} cards
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingGoal(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal.mutate(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {isOverdue ? `Atrasada há ${Math.abs(daysRemaining)} dias` : 
                       daysRemaining === 0 ? "Vence hoje" :
                       `Vence em ${daysRemaining} dias`}
                    </span>
                  </div>
                  
                  {isCompleted && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Concluída!</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateGoalDialog({ 
  isOpen, 
  onOpenChange, 
  onCreateGoal 
}: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
  onCreateGoal: (data: any) => void; 
}) {
  const [formData, setFormData] = useState({
    title: "",
    target_cards: 0,
    target_date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.target_cards > 0 && formData.target_date) {
      onCreateGoal(formData);
      setFormData({ title: "", target_cards: 0, target_date: "" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Meta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título da Meta</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Estudar 100 cards de matemática"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="target_cards">Número de Cards</Label>
            <Input
              id="target_cards"
              type="number"
              value={formData.target_cards}
              onChange={(e) => setFormData(prev => ({ ...prev, target_cards: parseInt(e.target.value) || 0 }))}
              placeholder="100"
              min="1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="target_date">Data Limite</Label>
            <Input
              id="target_date"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Meta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
