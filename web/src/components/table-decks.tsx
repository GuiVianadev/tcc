import { TableItemDeck } from "./table-item-deck";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

export function TableDecks() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[450px] font-bold">Decks</TableHead>
          <TableHead className="text-right font-bold">Novo</TableHead>
          <TableHead className="text-right font-bold">Aprender</TableHead>
          <TableHead className="text-right font-bold">Vencimento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-full">
        <TableItemDeck />
      </TableBody>
    </Table>
  );
}
