
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import { ContractForm } from "@/components/contracts/ContractForm";
import { useContracts } from "@/domains/contracts/hooks/useContracts";
import { Contract } from "@/domains/contracts/types";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { StatusIndicator } from "@/components/atoms/StatusIndicator";
import { DataTableActions } from "@/components/molecules/DataTableActions";
import { Heading } from "@/components/atoms/Typography";
import { formatCurrency, formatDate, calculateDaysUntil } from "@/shared/utils/formatters";

const Contracts = () => {
  const { contracts, loading, createContract, updateContract, deleteContract } = useContracts();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCreateContract = async (data: any) => {
    await createContract(data);
    setIsCreateModalOpen(false);
  };

  const handleEditContract = async (data: any) => {
    if (!selectedContract) return;
    
    await updateContract({ id: selectedContract.id, ...data });
    setIsEditModalOpen(false);
    setSelectedContract(null);
  };

  const handleDeleteContract = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      await deleteContract(id);
    }
  };

  const getDeadlineIndicator = (contract: Contract) => {
    if (contract.status === 'concluido' || contract.status === 'cancelado') {
      return null;
    }

    const daysLeft = calculateDaysUntil(contract.endDate);
    return <StatusIndicator daysLeft={daysLeft} type="deadline" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Contratos</Heading>
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
                      <TableCell>
                        <StatusBadge status={contract.status} />
                      </TableCell>
                      <TableCell>{formatDate(contract.startDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{formatDate(contract.endDate)}</span>
                          {getDeadlineIndicator(contract)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DataTableActions
                          onEdit={() => {
                            setSelectedContract(contract);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => handleDeleteContract(contract.id)}
                        />
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
