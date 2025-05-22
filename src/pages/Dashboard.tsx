
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, AreaChart, PieChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Area, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart2, Users, FileText, ClipboardList, Clock } from "lucide-react";

const Dashboard = () => {
  // Sample data for KPIs
  const kpiData = {
    totalClients: 342,
    proposalsSent: 215,
    contractsClosed: 187,
    projectedRevenue: "R$ 980.500,00"
  };

  // Sample data for sales funnel chart
  const funnelData = [
    { name: "Contato Inicial", value: 120 },
    { name: "Proposta", value: 85 },
    { name: "Contrato", value: 60 },
    { name: "Serviço", value: 40 },
    { name: "Finalizado", value: 25 }
  ];

  // Sample data for monthly evolution chart
  const monthlyData = [
    { name: "Jan", proposals: 18, contracts: 12 },
    { name: "Fev", proposals: 22, contracts: 15 },
    { name: "Mar", proposals: 26, contracts: 20 },
    { name: "Abr", proposals: 24, contracts: 18 },
    { name: "Mai", proposals: 30, contracts: 24 },
    { name: "Jun", proposals: 28, contracts: 22 }
  ];

  // Sample data for geographic distribution
  const geoData = [
    { name: "SP", value: 40 },
    { name: "RJ", value: 25 },
    { name: "MG", value: 15 },
    { name: "RS", value: 10 },
    { name: "PR", value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Sample data for alerts
  const alerts = [
    { id: 1, type: "Proposta", title: "Proposta #238 - Cliente XYZ", expiry: "2 dias" },
    { id: 2, type: "Contrato", title: "Contrato #156 - Empresa ABC", renewal: "5 dias" },
    { id: 3, type: "Serviço", title: "Serviço #94 - Consultoria", status: "Em andamento" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalClients}</div>
            <p className="text-xs text-muted-foreground">No funil de vendas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Propostas Enviadas</CardTitle>
            <FileText size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.proposalsSent}</div>
            <p className="text-xs text-muted-foreground">Total enviado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contratos Fechados</CardTitle>
            <ClipboardList size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.contractsClosed}</div>
            <p className="text-xs text-muted-foreground">Assinados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Previsto</CardTitle>
            <BarChart2 size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.projectedRevenue}</div>
            <p className="text-xs text-muted-foreground">Próximos 90 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
            <CardDescription>Clientes em cada etapa do processo</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
            <CardDescription>Propostas e contratos por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="proposals" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.8} />
                <Area type="monotone" dataKey="contracts" stackId="1" stroke="#0c4a6e" fill="#0c4a6e" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição Geográfica</CardTitle>
            <CardDescription>Clientes por estado</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={geoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {geoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>Itens que requerem sua atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id}>
                  <Clock className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    {alert.title}
                    <Badge variant={
                      alert.type === "Proposta" ? "default" :
                      alert.type === "Contrato" ? "secondary" : "outline"
                    }>
                      {alert.type}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription>
                    {alert.expiry && `Expira em ${alert.expiry}`}
                    {alert.renewal && `Renovação em ${alert.renewal}`}
                    {alert.status && `Status: ${alert.status}`}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
