
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash, MoreHorizontal, Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: "Empresa ABC Ltda",
    razaoSocial: "ABC Comercio e Serviços LTDA",
    cnpj: "12.345.678/0001-90",
    status: "Ativo",
    createdAt: "2023-06-15",
    city: "São Paulo",
    state: "SP"
  },
  {
    id: 2,
    name: "XYZ Tecnologia",
    razaoSocial: "XYZ Tecnologia da Informação S.A.",
    cnpj: "98.765.432/0001-21",
    status: "Proposta",
    createdAt: "2023-07-22",
    city: "Rio de Janeiro",
    state: "RJ"
  },
  {
    id: 3,
    name: "Consultoria Inovare",
    razaoSocial: "Inovare Consultoria Empresarial LTDA",
    cnpj: "45.678.901/0001-23",
    status: "Contrato",
    createdAt: "2023-08-05",
    city: "Belo Horizonte",
    state: "MG"
  },
  {
    id: 4,
    name: "Tech Solutions",
    razaoSocial: "Tech Solutions Informática LTDA",
    cnpj: "23.456.789/0001-34",
    status: "Inativo",
    createdAt: "2023-09-10",
    city: "Curitiba",
    state: "PR"
  },
  {
    id: 5,
    name: "Global Services",
    razaoSocial: "Global Services Consultoria S.A.",
    cnpj: "34.567.890/0001-45",
    status: "Ativo",
    createdAt: "2023-10-18",
    city: "Brasília",
    state: "DF"
  },
  {
    id: 6,
    name: "Distribuidora Norte",
    razaoSocial: "Distribuidora Norte de Produtos EIRELI",
    cnpj: "56.789.012/0001-56",
    status: "Proposta",
    createdAt: "2023-11-25",
    city: "Recife",
    state: "PE"
  },
  {
    id: 7,
    name: "Indústria Sul",
    razaoSocial: "Indústria Sul de Componentes S.A.",
    cnpj: "67.890.123/0001-67",
    status: "Contrato",
    createdAt: "2023-12-03",
    city: "Porto Alegre",
    state: "RS"
  },
  {
    id: 8,
    name: "Construtora Horizonte",
    razaoSocial: "Construtora Horizonte LTDA",
    cnpj: "78.901.234/0001-78",
    status: "Ativo",
    createdAt: "2024-01-08",
    city: "Salvador",
    state: "BA"
  },
  {
    id: 9,
    name: "LogTech Transportes",
    razaoSocial: "LogTech Soluções em Transporte LTDA",
    cnpj: "89.012.345/0001-89",
    status: "Inativo",
    createdAt: "2024-02-15",
    city: "Manaus",
    state: "AM"
  },
  {
    id: 10,
    name: "Educação Futuro",
    razaoSocial: "Instituto Educação Futuro S.A.",
    cnpj: "90.123.456/0001-90",
    status: "Proposta",
    createdAt: "2024-03-20",
    city: "Fortaleza",
    state: "CE"
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  
  switch (status) {
    case "Ativo":
      variant = "default";
      break;
    case "Proposta":
      variant = "secondary";
      break;
    case "Contrato":
      variant = "outline";
      break;
    case "Inativo":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }
  
  return <Badge variant={variant}>{status}</Badge>;
};

const Clients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  
  const filteredClients = mockClients.filter(client => {
    return (
      (searchTerm === "" || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cnpj.includes(searchTerm)) &&
      (statusFilter === "all" || client.status === statusFilter) &&
      (stateFilter === "all" || client.state === stateFilter)
    );
  });

  const handleDelete = (id: number) => {
    toast.success("Cliente excluído com sucesso!");
    // In a real app, this would make an API call
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <Button onClick={() => navigate("/clientes/novo")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, razão social ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="md:w-40">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Contrato">Contrato</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-40">
              <Select 
                value={stateFilter} 
                onValueChange={setStateFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Razão Social</TableHead>
                  <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.razaoSocial}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.cnpj}</TableCell>
                      <TableCell>
                        <StatusBadge status={client.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{client.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/clientes/${client.id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/clientes/editar/${client.id}`)}>
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(client.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
