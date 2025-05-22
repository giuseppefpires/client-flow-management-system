
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="system">Preferências do Sistema</TabsTrigger>
          <TabsTrigger value="templates">Modelos de Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  Esta página está em desenvolvimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  Esta página está em desenvolvimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Modelos de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  Esta página está em desenvolvimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
