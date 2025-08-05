import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockHealthRecords } from "@/lib/mock-data";
import { format } from "date-fns";
import { RecordActions } from "./RecordActions";

export function RecordTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Profissional</TableHead>
          <TableHead>Tipo</TableHead>
           <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockHealthRecords.map((record) => (
          <TableRow key={record.id}>
             <TableCell>{format(new Date(record.data), "PPP")}</TableCell>
            <TableCell className="font-medium">{record.pacienteNome}</TableCell>
            <TableCell>{record.profissionalNome}</TableCell>
            <TableCell className="capitalize">{record.tipo}</TableCell>
            <TableCell>
                <RecordActions record={record} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
