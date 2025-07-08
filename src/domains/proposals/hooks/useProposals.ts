
import { useState, useEffect } from 'react';
import { Proposal, CreateProposalData, UpdateProposalData } from '../types';
import { ProposalService } from '../services/proposalService';
import { toast } from 'sonner';

export const useProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const data = await ProposalService.getAll();
      setProposals(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar propostas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (data: CreateProposalData) => {
    try {
      const newProposal = await ProposalService.create(data);
      setProposals(prev => [newProposal, ...prev]);
      toast.success('Proposta criada com sucesso!');
      return newProposal;
    } catch (err) {
      toast.error('Erro ao criar proposta');
      throw err;
    }
  };

  const updateProposal = async (data: UpdateProposalData) => {
    try {
      const updatedProposal = await ProposalService.update(data);
      if (updatedProposal) {
        setProposals(prev => prev.map(p => p.id === data.id ? updatedProposal : p));
        toast.success('Proposta atualizada com sucesso!');
        return updatedProposal;
      }
    } catch (err) {
      toast.error('Erro ao atualizar proposta');
      throw err;
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      const success = await ProposalService.delete(id);
      if (success) {
        setProposals(prev => prev.filter(p => p.id !== id));
        toast.success('Proposta excluída com sucesso!');
      }
    } catch (err) {
      toast.error('Erro ao excluir proposta');
      throw err;
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return {
    proposals,
    loading,
    error,
    createProposal,
    updateProposal,
    deleteProposal,
    refetch: fetchProposals
  };
};
