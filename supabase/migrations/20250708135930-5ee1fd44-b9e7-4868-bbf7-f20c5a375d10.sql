
-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Inserção automática de perfil" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar tabela de clientes
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clients
CREATE POLICY "Usuários podem ver seus próprios clientes" 
  ON public.clients 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios clientes" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios clientes" 
  ON public.clients 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios clientes" 
  ON public.clients 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar tabela de propostas
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela proposals
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para proposals
CREATE POLICY "Usuários podem ver suas próprias propostas" 
  ON public.proposals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias propostas" 
  ON public.proposals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias propostas" 
  ON public.proposals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias propostas" 
  ON public.proposals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar tabela de contratos
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  services TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela contracts
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contracts
CREATE POLICY "Usuários podem ver seus próprios contratos" 
  ON public.contracts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios contratos" 
  ON public.contracts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios contratos" 
  ON public.contracts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios contratos" 
  ON public.contracts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar tabela de serviços
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para services
CREATE POLICY "Usuários podem ver seus próprios serviços" 
  ON public.services 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios serviços" 
  ON public.services 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios serviços" 
  ON public.services 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios serviços" 
  ON public.services 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar tabela de transações financeiras
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela financial_transactions
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para financial_transactions
CREATE POLICY "Usuários podem ver suas próprias transações" 
  ON public.financial_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias transações" 
  ON public.financial_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias transações" 
  ON public.financial_transactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias transações" 
  ON public.financial_transactions 
  FOR DELETE 
  USING (auth.uid() = user_id);
