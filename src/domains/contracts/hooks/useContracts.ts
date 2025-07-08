
import { useState, useEffect } from 'react';
import { Contract, CreateContractData, UpdateContractData } from '../types';
import { ContractService } from '../services/contractService';
import { toast } from 'sonner';

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const data = await ContractService.getAll();
      setContracts(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar contratos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createContract = async (data: CreateContractData) => {
    try {
      const newContract = await ContractService.create(data);
      setContracts(prev => [newContract, ...prev]);
      toast.success('Contrato criado com sucesso!');
      return newContract;
    } catch (err) {
      toast.error('Erro ao criar contrato');
      throw err;
    }
  };

  const updateContract = async (data: UpdateContractData) => {
    try {
      const updatedContract = await ContractService.update(data);
      if (updatedContract) {
        setContracts(prev => prev.map(c => c.id === data.id ? updatedContract : c));
        toast.success('Contrato atualizado com sucesso!');
        return updatedContract;
      }
    } catch (err) {
      toast.error('Erro ao atualizar contrato');
      throw err;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      const success = await ContractService.delete(id);
      if (success) {
        setContracts(prev => prev.filter(c => c.id !== id));
        toast.success('Contrato excluído com sucesso!');
      }
    } catch (err) {
      toast.error('Erro ao excluir contrato');
      throw err;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    error,
    createContract,
    updateContract,
    deleteContract,
    refetch: fetchContracts
  };
};
