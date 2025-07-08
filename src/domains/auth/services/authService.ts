import { supabase } from '@/integrations/supabase/client';
import { LoginCredentials, SignUpCredentials, User, Profile, UserRole } from '../types';
import { validateEmail, isValidEmailDomain } from '@/shared/utils/validation';

export class AuthService {
  static async login(credentials: LoginCredentials) {
    // Validar email antes de tentar login
    if (!validateEmail(credentials.email)) {
      throw new Error('Email inválido');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      // Personalizar mensagens de erro
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Email não confirmado. Verifique sua caixa de entrada');
      }
      throw new Error(error.message);
    }

    return data;
  }

  static async signUp(credentials: SignUpCredentials) {
    // Validar email antes de tentar cadastro
    if (!validateEmail(credentials.email)) {
      throw new Error('Email inválido');
    }

    if (!isValidEmailDomain(credentials.email)) {
      throw new Error('Por favor, use um email real para cadastro');
    }

    const redirectUrl = `${window.location.origin}/auth`;
    
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
      // Personalizar mensagens de erro
      if (error.message.includes('User already registered')) {
        throw new Error('Este email já está cadastrado');
      }
      if (error.message.includes('Password should be at least')) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
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

  static async resetPassword(email: string) {
    // Validar email antes de tentar reset
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!isValidEmailDomain(email)) {
      throw new Error('Por favor, use um email real para recuperação de senha');
    }

    const redirectUrl = `${window.location.origin}/auth/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      // Personalizar mensagens de erro específicas
      if (error.message.includes('Email address') && error.message.includes('invalid')) {
        throw new Error('Endereço de email inválido. Use um email real');
      }
      if (error.message.includes('Email not found')) {
        throw new Error('Email não encontrado no sistema');
      }
      throw new Error(error.message);
    }

    return { success: true };
  }

  static async updatePassword(newPassword: string) {
    if (newPassword.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }

  static async resendConfirmation(email: string) {
    // Validar email antes de reenviar confirmação
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!isValidEmailDomain(email)) {
      throw new Error('Por favor, use um email real');
    }

    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl,
      }
    });

    if (error) {
      if (error.message.includes('Email address') && error.message.includes('invalid')) {
        throw new Error('Endereço de email inválido. Use um email real');
      }
      throw new Error(error.message);
    }

    return { success: true };
  }

  static async updateEmail(newEmail: string) {
    // Validar novo email
    if (!validateEmail(newEmail)) {
      throw new Error('Email inválido');
    }

    if (!isValidEmailDomain(newEmail)) {
      throw new Error('Por favor, use um email real');
    }

    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (error) {
      if (error.message.includes('Email address') && error.message.includes('invalid')) {
        throw new Error('Endereço de email inválido. Use um email real');
      }
      throw new Error(error.message);
    }

    return { success: true };
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
      role: (profile.role || 'user') as UserRole,
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

    return {
      ...data,
      role: (data.role || 'user') as UserRole
    };
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

    return {
      ...data,
      role: (data.role || 'user') as UserRole
    };
  }

  static async checkPermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;

    if (user.role === 'admin') return true;

    return false;
  }
}
