import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "./ui/table";

export function TableItemDeck() {
  const navigate = useNavigate();
  return (
    <TableRow className="cursor-pointer" onClick={() => navigate("/decks/:id")}>
      <TableCell className="font-medium">React</TableCell>
      <TableCell className="text-right">20</TableCell>
      <TableCell className="text-right">40</TableCell>
      <TableCell className="text-right">10</TableCell>
    </TableRow>
  );
}
