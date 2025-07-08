
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Client = Tables<'clients'>;
export type CreateClientData = TablesInsert<'clients'>;
export type UpdateClientData = TablesUpdate<'clients'>;

export class ClientService {
  static async getAllClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }

    return data;
  }

  static async createClient(clientData: Omit<CreateClientData, 'user_id'>): Promise<Client> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...clientData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateClient(id: string, updates: Omit<UpdateClientData, 'user_id' | 'id'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
