import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import * as XLSX from 'xlsx';
import { toast } from "@/hooks/use-toast";

const operationsData = [
  { id: "005", name: "Токарная обработка", cost: 10 },
  { id: "010", name: "Фрезерная обработка", cost: 12 },
  { id: "015", name: "Сверление", cost: 8 },
  { id: "020", name: "Шлифование", cost: 15 },
  { id: "025", name: "Термообработка", cost: 20 },
  { id: "030", name: "Контроль ОТК", cost: 5 },
];

const employeesData = [
  "Иванов А.П.",
  "Петров С.М.",
  "Сидорова Е.К.",
  "Кузнецов И.В.",
  "Смирнов П.Н.",
  "Волков Д.А.",
];

const sampleOrders = [
  {
    id: "ЗН-2024-001",
    manager: "Козлов М.А.",
    dateReceived: "10.01.2026",
    deadline: "25.01.2026",
    expanded: false,
    details: [
      {
        launchDate: "11.01.2026",
        partNumber: "ТПК 000.00-187-401",
        partName: "ВТУЛКА",
        quantity: "1 шт",
        operationId: "005",
        timeNorm: 45,
        executor: "Иванов А.П.",
        completionDate: "12.01.2026",
      },
      {
        launchDate: "12.01.2026",
        partNumber: "ТПК 000.00-187-402",
        partName: "ФЛАНЕЦ",
        quantity: "2 шт",
        operationId: "010",
        timeNorm: 60,
        executor: "Петров С.М.",
        completionDate: "14.01.2026",
      },
    ],
  },
  {
    id: "ЗН-2024-002",
    manager: "Новикова Т.С.",
    dateReceived: "12.01.2026",
    deadline: "30.01.2026",
    expanded: false,
    details: [
      {
        launchDate: "13.01.2026",
        partNumber: "ТПК 000.00-188-101",
        partName: "КОРПУС",
        quantity: "1 шт",
        operationId: "005",
        timeNorm: 120,
        executor: "Кузнецов И.В.",
        completionDate: "15.01.2026",
      },
    ],
  },
];

const Index = () => {
  const [orders, setOrders] = useState(sampleOrders);

  const toggleOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, expanded: !order.expanded } : order
      )
    );
  };

  const calculateCost = (operationId: string, timeNorm: number) => {
    const operation = operationsData.find((op) => op.id === operationId);
    if (!operation) return 0;
    return (operation.cost * timeNorm).toFixed(2);
  };

  const getOperationName = (operationId: string) => {
    return operationsData.find((op) => op.id === operationId)?.name || "";
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    const ordersSheet: any[] = [];
    orders.forEach((order) => {
      ordersSheet.push({
        'Номер заказ-наряда': order.id,
        'Менеджер': order.manager,
        'Дата принятия': order.dateReceived,
        'Срок сдачи': order.deadline,
      });
      ordersSheet.push({});
      ordersSheet.push({
        'Дата запуска': 'Дата запуска',
        'Номер детали': 'Номер детали',
        'Наименование': 'Наименование',
        'Количество': 'Количество',
        'Операция': '№ операции',
        'Название операции': 'Название операции',
        'Норма времени, мин': 'Норма времени, мин',
        'Исполнитель': 'Исполнитель',
        'Стоимость, ₽': 'Стоимость, ₽',
        'Дата сдачи': 'Дата сдачи',
      });
      order.details.forEach((detail) => {
        ordersSheet.push({
          'Дата запуска': detail.launchDate,
          'Номер детали': detail.partNumber,
          'Наименование': detail.partName,
          'Количество': detail.quantity,
          'Операция': detail.operationId,
          'Название операции': getOperationName(detail.operationId),
          'Норма времени, мин': detail.timeNorm,
          'Исполнитель': detail.executor,
          'Стоимость, ₽': calculateCost(detail.operationId, detail.timeNorm),
          'Дата сдачи': detail.completionDate,
        });
      });
      const totalTime = order.details.reduce((sum, d) => sum + d.timeNorm, 0);
      const totalCost = order.details.reduce(
        (sum, d) => sum + parseFloat(calculateCost(d.operationId, d.timeNorm)),
        0
      ).toFixed(2);
      ordersSheet.push({});
      ordersSheet.push({
        'Дата запуска': 'ИТОГО:',
        'Норма времени, мин': totalTime,
        'Стоимость, ₽': totalCost,
      });
      ordersSheet.push({});
    });

    const ws1 = XLSX.utils.json_to_sheet(ordersSheet, { skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, ws1, 'Заказ-наряды');

    const operationsSheet = operationsData.map((op) => ({
      '№ операции': op.id,
      'Наименование операции': op.name,
      'Стоимость, ₽/мин': op.cost,
    }));
    const ws2 = XLSX.utils.json_to_sheet(operationsSheet);
    XLSX.utils.book_append_sheet(workbook, ws2, 'Справочник операций');

    const employeesSheet = employeesData.map((emp, idx) => ({
      '№': idx + 1,
      'ФИО сотрудника': emp,
    }));
    const ws3 = XLSX.utils.json_to_sheet(employeesSheet);
    XLSX.utils.book_append_sheet(workbook, ws3, 'Справочник сотрудников');

    const fileName = `Планирование_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Экспорт завершён",
      description: `Файл ${fileName} успешно сохранён`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Factory" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Планирование машиностроительного производства</h1>
                <p className="text-sm text-sidebar-foreground/70">Подетальный учет заказ-нарядов</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={exportToExcel}>
                <Icon name="Download" size={18} />
                Экспорт в Excel
              </Button>
              <Button className="gap-2">
                <Icon name="Plus" size={18} />
                Новый заказ-наряд
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="gap-2">
              <Icon name="ClipboardList" size={16} />
              Заказ-наряды
            </TabsTrigger>
            <TabsTrigger value="operations" className="gap-2">
              <Icon name="Settings" size={16} />
              Справочник операций
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Icon name="Users" size={16} />
              Справочник сотрудников
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 animate-fade-in">
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
                                        suffix="мин"
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
          </TabsContent>

          <TabsContent value="operations" className="animate-fade-in">
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
          </TabsContent>

          <TabsContent value="employees" className="animate-fade-in">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Справочник сотрудников</CardTitle>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить сотрудника
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employeesData.map((emp, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon name="User" size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{emp}</p>
                            <p className="text-xs text-muted-foreground">Исполнитель</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Icon name="Pencil" size={14} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-dashed">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="Info" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Как работает таблица планирования:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Заказ-наряд</strong> — основная единица. Содержит номер, менеджера, даты</li>
                  <li>• <strong>Подетальный список</strong> — раскрывается при клике на заказ-наряд</li>
                  <li>• <strong>Операции</strong> — выбираются из справочника с автоматическим расчетом стоимости</li>
                  <li>• <strong>Исполнители</strong> — выбираются из справочника сотрудников</li>
                  <li>• <strong>Стоимость</strong> — рассчитывается автоматически: норма времени × стоимость операции</li>
                </ul>
                <p className="mt-3 text-sm font-semibold text-primary">
                  Пожалуйста, проверьте структуру таблицы. После согласования добавим данные из вашей сводной таблицы!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;