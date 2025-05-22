
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Contracts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Contrato
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
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

export default Contracts;
