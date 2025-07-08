
import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/authService';
import { AuthState, LoginCredentials, SignUpCredentials } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.login(credentials);
      
      if (result.user) {
        const user = await AuthService.getCurrentUser();
        setState(prev => ({ 
          ...prev, 
          user, 
          session: result.session,
          loading: false 
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro no login',
        loading: false 
      }));
      return false;
    }
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.signUp(credentials);
      
      setState(prev => ({ 
        ...prev, 
        loading: false 
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro no cadastro',
        loading: false 
      }));
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.resetPassword(email);
      
      setState(prev => ({ 
        ...prev, 
        loading: false 
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao enviar email de recuperação',
        loading: false 
      }));
      throw error;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.updatePassword(newPassword);
      
      setState(prev => ({ 
        ...prev, 
        loading: false 
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao atualizar senha',
        loading: false 
      }));
      throw error;
    }
  }, []);

  const resendConfirmation = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.resendConfirmation(email);
      
      setState(prev => ({ 
        ...prev, 
        loading: false 
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao reenviar confirmação',
        loading: false 
      }));
      throw error;
    }
  }, []);

  const updateEmail = useCallback(async (newEmail: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.updateEmail(newEmail);
      
      setState(prev => ({ 
        ...prev, 
        loading: false 
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao atualizar email',
        loading: false 
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro no logout' 
      }));
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        
        if (session?.user) {
          const user = await AuthService.getCurrentUser();
          setState({
            user,
            session,
            loading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            session: null,
            loading: false,
            error: null,
          });
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const user = await AuthService.getCurrentUser();
        setState({
          user,
          session,
          loading: false,
          error: null,
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...state,
    login,
    signUp,
    logout,
    resetPassword,
    updatePassword,
    resendConfirmation,
    updateEmail,
    isAuthenticated: !!state.user,
  };
};
