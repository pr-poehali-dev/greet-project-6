import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import * as XLSX from 'xlsx';
import { toast } from "@/hooks/use-toast";
import { operationsData, employeesData, sampleOrders, Order } from "@/components/planning/data";
import { OrdersTab } from "@/components/planning/OrdersTab";
import { OperationsTab } from "@/components/planning/OperationsTab";
import { EmployeesTab } from "@/components/planning/EmployeesTab";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const toggleOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, expanded: !order.expanded } : order
      )
    );
  };

  const calculateCost = (operationId: string, timeNorm: number) => {
    const operation = operationsData.find((op) => op.id === operationId);
    if (!operation) return "0";
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
            <OrdersTab orders={orders} toggleOrder={toggleOrder} calculateCost={calculateCost} />
          </TabsContent>

          <TabsContent value="operations" className="animate-fade-in">
            <OperationsTab />
          </TabsContent>

          <TabsContent value="employees" className="animate-fade-in">
            <EmployeesTab />
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
