
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Eye, FileText, Trash2 } from "lucide-react";
import { mockContracts, type Contract } from "@/data/mockContracts";
import { ContractForm } from "@/components/contracts/ContractForm";

const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getStatusBadge = (status: Contract['status']) => {
    const statusConfig = {
      ativo: { label: "Ativo", variant: "default" as const },
      concluido: { label: "Concluído", variant: "secondary" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const },
      pausado: { label: "Pausado", variant: "secondary" as const }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleCreateContract = (data: any) => {
    const newContract: Contract = {
      id: String(Date.now()),
      ...data,
      startDate: data.startDate.toISOString().split('T')[0],
      endDate: data.endDate.toISOString().split('T')[0],
      signedAt: new Date().toISOString().split('T')[0],
      services: data.services || []
    };
    
    setContracts([newContract, ...contracts]);
    setIsCreateModalOpen(false);
  };

  const handleEditContract = (data: any) => {
    if (!selectedContract) return;
    
    const updatedContract: Contract = {
      ...selectedContract,
      ...data,
      startDate: data.startDate.toISOString().split('T')[0],
      endDate: data.endDate.toISOString().split('T')[0],
      services: data.services || []
    };
    
    setContracts(contracts.map(c => c.id === selectedContract.id ? updatedContract : c));
    setIsEditModalOpen(false);
    setSelectedContract(null);
  };

  const handleDeleteContract = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Contrato</DialogTitle>
            </DialogHeader>
            <ContractForm onSubmit={handleCreateContract} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Nenhum contrato encontrado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Término</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.client}</TableCell>
                      <TableCell>{contract.title}</TableCell>
                      <TableCell>{formatCurrency(contract.value)}</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell>{formatDate(contract.startDate)}</TableCell>
                      <TableCell>{formatDate(contract.endDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedContract(contract);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContract(contract.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contrato</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <ContractForm
              contract={selectedContract}
              onSubmit={handleEditContract}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
