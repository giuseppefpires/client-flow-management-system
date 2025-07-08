
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
import { ProposalForm } from "@/components/proposals/ProposalForm";
import { useProposals } from "@/domains/proposals/hooks/useProposals";
import { Proposal } from "@/domains/proposals/types";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { StatusIndicator } from "@/components/atoms/StatusIndicator";
import { DataTableActions } from "@/components/molecules/DataTableActions";
import { Heading } from "@/components/atoms/Typography";
import { formatCurrency, formatDate, calculateDaysUntil } from "@/shared/utils/formatters";

const Proposals = () => {
  const { proposals, loading, createProposal, updateProposal, deleteProposal } = useProposals();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCreateProposal = async (data: any) => {
    await createProposal(data);
    setIsCreateModalOpen(false);
  };

  const handleEditProposal = async (data: any) => {
    if (!selectedProposal) return;
    
    await updateProposal({ id: selectedProposal.id, ...data });
    setIsEditModalOpen(false);
    setSelectedProposal(null);
  };

  const handleDeleteProposal = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
      await deleteProposal(id);
    }
  };

  const getExpiryIndicator = (proposal: Proposal) => {
    if (proposal.status === 'aceita' || proposal.status === 'rejeitada' || proposal.status === 'vencida') {
      return null;
    }

    const daysLeft = calculateDaysUntil(proposal.validUntil);
    return <StatusIndicator daysLeft={daysLeft} type="expiry" />;
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
        <Heading>Propostas</Heading>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Proposta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Proposta</DialogTitle>
            </DialogHeader>
            <ProposalForm onSubmit={handleCreateProposal} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Propostas</CardTitle>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma proposta encontrada.
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
                    <TableHead>Criada em</TableHead>
                    <TableHead>Válida até</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{proposal.client}</TableCell>
                      <TableCell>{proposal.title}</TableCell>
                      <TableCell>{formatCurrency(proposal.value)}</TableCell>
                      <TableCell>
                        <StatusBadge status={proposal.status} />
                      </TableCell>
                      <TableCell>{formatDate(proposal.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{formatDate(proposal.validUntil)}</span>
                          {getExpiryIndicator(proposal)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DataTableActions
                          onEdit={() => {
                            setSelectedProposal(proposal);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => handleDeleteProposal(proposal.id)}
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
            <DialogTitle>Editar Proposta</DialogTitle>
          </DialogHeader>
          {selectedProposal && (
            <ProposalForm
              proposal={selectedProposal}
              onSubmit={handleEditProposal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Proposals;
