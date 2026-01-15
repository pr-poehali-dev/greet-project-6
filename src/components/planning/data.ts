export const operationsData = [
  { id: "005", name: "Токарная обработка", cost: 10 },
  { id: "010", name: "Фрезерная обработка", cost: 12 },
  { id: "015", name: "Сверление", cost: 8 },
  { id: "020", name: "Шлифование", cost: 15 },
  { id: "025", name: "Термообработка", cost: 20 },
  { id: "030", name: "Контроль ОТК", cost: 5 },
];

export const employeesData = [
  "Иванов А.П.",
  "Петров С.М.",
  "Сидорова Е.К.",
  "Кузнецов И.В.",
  "Смирнов П.Н.",
  "Волков Д.А.",
];

export interface OrderDetail {
  launchDate: string;
  partNumber: string;
  partName: string;
  quantity: string;
  operationId: string;
  timeNorm: number;
  executor: string;
  completionDate: string;
}

export interface Order {
  id: string;
  manager: string;
  dateReceived: string;
  deadline: string;
  expanded: boolean;
  details: OrderDetail[];
}

export const sampleOrders: Order[] = [
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
