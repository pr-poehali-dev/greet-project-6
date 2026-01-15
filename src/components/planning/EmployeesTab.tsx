import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { employeesData } from "./data";

export const EmployeesTab = () => {
  return (
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
  );
};
