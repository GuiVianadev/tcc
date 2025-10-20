import { Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecentCards } from "@/api/queries/dashboard";
import { Link } from "react-router-dom";

export function RecentCards() {
  const { data: recentCards, isLoading, error } = useRecentCards();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cards Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gray-200 animate-pulse rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
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
            <Clock className="h-5 w-5" />
            Cards Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-4">
            Erro ao carregar cards recentes
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recentCards || recentCards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cards Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            Nenhum card estudado recentemente
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-100 text-green-800";
    if (accuracy >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Agora mesmo";
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Ontem";
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Cards Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCards.map((card) => (
            <div key={card.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {card.front}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getAccuracyColor(card.accuracy)}`}
                  >
                    {card.accuracy}%
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {card.back}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {card.deck_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(card.studied_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recentCards.length >= 5 && (
          <div className="mt-4 pt-4 border-t">
            <Link
              to="/app/flashcards"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todos os flashcards →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
