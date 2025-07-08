
import { useState, useEffect } from 'react';
import { ClientService, Client, CreateClientData, UpdateClientData } from '../services/clientService';
import { toast } from 'sonner';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ClientService.getAllClients();
      setClients(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar clientes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<CreateClientData, 'user_id'>) => {
    try {
      const newClient = await ClientService.createClient(clientData);
      setClients(prev => [newClient, ...prev]);
      toast.success('Cliente criado com sucesso!');
      return newClient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Omit<UpdateClientData, 'user_id' | 'id'>) => {
    try {
      const updatedClient = await ClientService.updateClient(id, updates);
      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
      toast.success('Cliente atualizado com sucesso!');
      return updatedClient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await ClientService.deleteClient(id);
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Cliente excluído com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cliente';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};
