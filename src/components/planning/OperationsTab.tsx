import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Icon from "@/components/ui/icon";
import { operationsData } from "./data";

export const OperationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Справочник технологических операций</CardTitle>
          <Button variant="outline" className="gap-2">
            <Icon name="Plus" size={16} />
            Добавить операцию
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№ операции</TableHead>
              <TableHead>Наименование</TableHead>
              <TableHead>Стоимость, ₽/мин</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operationsData.map((op) => (
              <TableRow key={op.id}>
                <TableCell className="font-mono font-bold">{op.id}</TableCell>
                <TableCell className="font-semibold">{op.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    {op.cost} ₽/мин
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Icon name="Pencil" size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
