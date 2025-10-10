import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Simulados() {
  return (
    <div className="m-auto flex max-w-[1440px] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.1">
          <h1 className="font-bold text-2xl">Meus simulados</h1>
          <span className="text-l text-muted-foreground">
            Gerencie seus simulados
          </span>
        </div>
        <Button className="flex gap-1">
          <Plus />
          Novo Simulado
        </Button>
      </div>

      <div>
        <Input placeholder="Buscar simulados" type="text" />
      </div>

      <div>
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-2">
              <Inbox className="h-8 w-8" />
              <div className="text-center">
                <h1 className="font-bold">Nenhum simulado encontrado</h1>
                <span className="text-muted-foreground text-sm">
                  Crie seu primeiro simulado para começar a estudar
                </span>
              </div>
              <Button>
                <Plus /> Crie o Primeiro Simulado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
