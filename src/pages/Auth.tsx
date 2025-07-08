
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/domains/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'verify-email';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [searchParams] = useSearchParams();
  
  const { login, signUp, resetPassword, updatePassword, resendConfirmation, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se há parâmetros de URL para definir o modo
  useEffect(() => {
    const type = searchParams.get('type');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      toast.error(errorDescription || error);
    }
    
    if (type === 'recovery') {
      setAuthMode('reset-password');
    } else if (type === 'signup') {
      setAuthMode('verify-email');
    }
  }, [searchParams]);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || "/";
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login({ email, password });
      if (success) {
        const from = (location.state as { from?: string })?.from || "/";
        navigate(from);
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp({ email, password, full_name: fullName });
      setAuthMode('verify-email');
      toast.success("Cadastro realizado! Verifique seu email para confirmar a conta.");
    } catch (error) {
      toast.error("Erro no cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
      setAuthMode('login');
    } catch (error) {
      toast.error("Erro ao enviar email de recuperação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    
    try {
      await updatePassword(password);
      toast.success("Senha atualizada com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao atualizar senha.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error("Por favor, insira seu email.");
      return;
    }

    setIsLoading(true);
    
    try {
      await resendConfirmation(email);
      toast.success("Email de confirmação reenviado!");
    } catch (error) {
      toast.error("Erro ao reenviar confirmação.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="seu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <Button
          type="button"
          variant="link"
          className="px-0 h-auto"
          onClick={() => setAuthMode('forgot-password')}
        >
          Esqueceu sua senha?
        </Button>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </CardFooter>
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            placeholder="Seu Nome"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signupEmail">Email</Label>
          <Input
            id="signupEmail"
            placeholder="seu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signupPassword">Senha</Label>
          <Input
            id="signupPassword"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </CardFooter>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword}>
      <CardContent className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Digite seu email para receber as instruções de recuperação de senha.
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <Label htmlFor="resetEmail">Email</Label>
          <Input
            id="resetEmail"
            placeholder="seu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar Email de Recuperação"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setAuthMode('login')}
        >
          Voltar ao Login
        </Button>
      </CardFooter>
    </form>
  );

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword}>
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Digite sua nova senha abaixo.
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nova Senha</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
          <Input
            id="confirmNewPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Atualizando..." : "Atualizar Senha"}
        </Button>
      </CardFooter>
    </form>
  );

  const renderVerifyEmailView = () => (
    <CardContent className="space-y-4">
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          Enviamos um email de confirmação para <strong>{email}</strong>. 
          Clique no link do email para ativar sua conta.
        </AlertDescription>
      </Alert>
      <div className="space-y-2">
        <Label htmlFor="verifyEmail">Email (para reenvio)</Label>
        <Input
          id="verifyEmail"
          placeholder="seu@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
    </CardContent>
  );

  if (authMode === 'verify-email') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-700 to-brand-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Confirme seu Email</CardTitle>
              <CardDescription>
                Verifique sua caixa de entrada
              </CardDescription>
            </CardHeader>
            {renderVerifyEmailView()}
            <CardFooter className="flex flex-col space-y-2">
              <Button
                onClick={handleResendConfirmation}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Reenviando..." : "Reenviar Email"}
              </Button>
              <Button
                onClick={() => setAuthMode('login')}
                variant="ghost"
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (authMode === 'forgot-password') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-700 to-brand-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
              <CardDescription>
                Enviaremos instruções para seu email
              </CardDescription>
            </CardHeader>
            {renderForgotPasswordForm()}
          </Card>
        </div>
      </div>
    );
  }

  if (authMode === 'reset-password') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-700 to-brand-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Nova Senha</CardTitle>
              <CardDescription>
                Digite sua nova senha
              </CardDescription>
            </CardHeader>
            {renderResetPasswordForm()}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-700 to-brand-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sistema de Gestão</CardTitle>
            <CardDescription>
              Entre ou cadastre-se para acessar
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {renderLoginForm()}
            </TabsContent>
            
            <TabsContent value="signup">
              {renderSignUpForm()}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
