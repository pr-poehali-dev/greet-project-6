import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Icon from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Order } from "./data";
import { operationsData, employeesData } from "./data";

interface OrdersTabProps {
  orders: Order[];
  toggleOrder: (orderId: string) => void;
  calculateCost: (operationId: string, timeNorm: number) => string;
}

export const OrdersTab = ({ orders, toggleOrder, calculateCost }: OrdersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Список заказ-нарядов</CardTitle>
          <Badge variant="secondary">Активных: {orders.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div
                className="p-4 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrder(order.id);
                    }}
                  >
                    <Icon
                      name={order.expanded ? "ChevronDown" : "ChevronRight"}
                      size={20}
                    />
                  </Button>
                  <div className="grid grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Номер заказ-наряда</p>
                      <p className="font-mono font-bold text-primary">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Менеджер</p>
                      <p className="font-semibold">{order.manager}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Дата принятия</p>
                      <p className="font-semibold">{order.dateReceived}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Срок сдачи</p>
                      <p className="font-semibold text-destructive">{order.deadline}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {order.details.length} деталей
                  </Badge>
                </div>
              </div>

              {order.expanded && (
                <div className="p-4 bg-card animate-fade-in">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Подетальный список операций
                    </h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="Plus" size={14} />
                      Добавить деталь
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[110px]">Дата запуска</TableHead>
                          <TableHead className="w-[150px]">Номер детали</TableHead>
                          <TableHead className="w-[140px]">Наименование</TableHead>
                          <TableHead className="w-[90px]">Кол-во</TableHead>
                          <TableHead className="w-[120px]">№ операции</TableHead>
                          <TableHead className="w-[100px]">Норма времени</TableHead>
                          <TableHead className="w-[150px]">Исполнитель</TableHead>
                          <TableHead className="w-[120px]">Стоимость, ₽</TableHead>
                          <TableHead className="w-[110px]">Дата сдачи</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.details.map((detail, idx) => (
                          <TableRow key={idx} className="hover:bg-muted/20">
                            <TableCell>
                              <Input
                                type="text"
                                defaultValue={detail.launchDate}
                                className="h-8 text-sm"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                defaultValue={detail.partNumber}
                                className="h-8 font-mono text-sm"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                defaultValue={detail.partName}
                                className="h-8 text-sm font-semibold"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                defaultValue={detail.quantity}
                                className="h-8 text-sm text-center"
                              />
                            </TableCell>
                            <TableCell>
                              <Select defaultValue={detail.operationId}>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {operationsData.map((op) => (
                                    <SelectItem key={op.id} value={op.id}>
                                      {op.id} - {op.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                defaultValue={detail.timeNorm}
                                className="h-8 text-sm text-right"
                              />
                            </TableCell>
                            <TableCell>
                              <Select defaultValue={detail.executor}>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {employeesData.map((emp) => (
                                    <SelectItem key={emp} value={emp}>
                                      {emp}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Input
                                  type="text"
                                  value={calculateCost(
                                    detail.operationId,
                                    detail.timeNorm
                                  )}
                                  readOnly
                                  className="h-8 text-sm font-bold text-right bg-accent/10"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="text"
                                defaultValue={detail.completionDate}
                                className="h-8 text-sm"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-semibold">Итого по заказу:</p>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Время работ</p>
                        <p className="font-bold">
                          {order.details.reduce(
                            (sum, d) => sum + d.timeNorm,
                            0
                          )}{" "}
                          мин
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Стоимость</p>
                        <p className="text-lg font-bold text-primary">
                          {order.details
                            .reduce(
                              (sum, d) =>
                                sum +
                                parseFloat(
                                  calculateCost(d.operationId, d.timeNorm)
                                ),
                              0
                            )
                            .toFixed(2)}{" "}
                          ₽
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
