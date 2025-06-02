
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
import { mockProposals, type Proposal } from "@/data/mockProposals";
import { ProposalForm } from "@/components/proposals/ProposalForm";

const Proposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getStatusBadge = (status: Proposal['status']) => {
    const statusConfig = {
      rascunho: { label: "Rascunho", variant: "secondary" as const },
      enviada: { label: "Enviada", variant: "default" as const },
      aceita: { label: "Aceita", variant: "default" as const },
      rejeitada: { label: "Rejeitada", variant: "destructive" as const },
      vencida: { label: "Vencida", variant: "secondary" as const }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleCreateProposal = (data: any) => {
    const newProposal: Proposal = {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
      validUntil: data.validUntil.toISOString().split('T')[0],
      services: data.services || []
    };
    
    setProposals([newProposal, ...proposals]);
    setIsCreateModalOpen(false);
  };

  const handleEditProposal = (data: any) => {
    if (!selectedProposal) return;
    
    const updatedProposal: Proposal = {
      ...selectedProposal,
      ...data,
      validUntil: data.validUntil.toISOString().split('T')[0],
      services: data.services || []
    };
    
    setProposals(proposals.map(p => p.id === selectedProposal.id ? updatedProposal : p));
    setIsEditModalOpen(false);
    setSelectedProposal(null);
  };

  const handleDeleteProposal = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
      setProposals(proposals.filter(p => p.id !== id));
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
        <h1 className="text-3xl font-bold tracking-tight">Propostas</h1>
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
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell>{formatDate(proposal.createdAt)}</TableCell>
                      <TableCell>{formatDate(proposal.validUntil)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProposal(proposal);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProposal(proposal.id)}
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
