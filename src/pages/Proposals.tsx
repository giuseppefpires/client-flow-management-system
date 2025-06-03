
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
import { Plus, Edit, Eye, FileText, Trash2, Clock, AlertTriangle } from "lucide-react";
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

  const getDaysUntilExpiry = (validUntil: string) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryIndicator = (proposal: Proposal) => {
    if (proposal.status === 'aceita' || proposal.status === 'rejeitada' || proposal.status === 'vencida') {
      return null;
    }

    const daysLeft = getDaysUntilExpiry(proposal.validUntil);
    
    if (daysLeft < 0) {
      return <AlertTriangle className="h-4 w-4 text-red-500" title="Vencida" />;
    } else if (daysLeft <= 3) {
      return <Clock className="h-4 w-4 text-orange-500" title={`${daysLeft} dias restantes`} />;
    } else if (daysLeft <= 7) {
      return <Clock className="h-4 w-4 text-yellow-500" title={`${daysLeft} dias restantes`} />;
    }
    
    return null;
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
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{formatDate(proposal.validUntil)}</span>
                          {getExpiryIndicator(proposal)}
                        </div>
                      </TableCell>
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
