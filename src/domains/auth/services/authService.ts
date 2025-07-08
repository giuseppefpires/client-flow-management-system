
import { supabase } from '@/integrations/supabase/client';
import { LoginCredentials, SignUpCredentials, User, Profile } from '../types';

export class AuthService {
  static async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async signUp(credentials: SignUpCredentials) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: credentials.full_name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Buscar perfil do usuário
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      full_name: profile.full_name || '',
      avatar_url: profile.avatar_url,
      role: profile.role as 'admin' | 'user' | 'moderator',
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }

    return data;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async checkPermission(permission: string): Promise<boolean> {
    // Implementar lógica de verificação de permissão baseada em role
    const user = await this.getCurrentUser();
    if (!user) return false;

    // Exemplo: admins têm todas as permissões
    if (user.role === 'admin') return true;

    // Implementar outras verificações conforme necessário
    return false;
  }
}
