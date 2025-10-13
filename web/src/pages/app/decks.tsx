import { Inbox, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { TableDecks } from "@/components/table-decks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Decks() {
  return (
    <div className="m-auto flex max-w-[1440px] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.1">
          <h1 className="font-bold text-2xl">Meus decks</h1>
          <span className="text-l text-muted-foreground">
            Gerencie seus decks de flashcards
          </span>
        </div>
        <Link to={"/decks/create/:id"}>
          <Button className="flex gap-1">
            <Plus />
            Novo Deck
          </Button>
        </Link>
      </div>

      <div>
        <Input placeholder="Buscar decks" type="text" />
      </div>

      <div>
        <Card>
          <CardContent className="grid">
            {/* <div className="flex flex-col items-center justify-center gap-2">
              <Inbox className="h-8 w-8" />
              <div className="text-center">
                <h1 className="font-bold">Nenhum deck encontrado</h1>
                <span className="text-muted-foreground text-sm">
                  Crie seu primeiro deck para começar a estudar
                </span>
              </div>
              <Link to={"/decks/create/:id"}>
                <Button>
                  <Plus /> Crie o Primeiro Deck
                </Button>
              </Link>
            </div> */}
            <TableDecks />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
