
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Financial = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar Relatório
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Faturamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Esta página está em desenvolvimento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financial;
