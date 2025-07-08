
import React, { useState } from "react";
import { useAuth } from "@/domains/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Settings, LogOut, Mail, Lock } from "lucide-react";

export const UserProfileDropdown = () => {
  const { user, logout, updateEmail, updatePassword } = useAuth();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateEmail = async () => {
    if (!newEmail) {
      toast.error("Por favor, insira o novo email.");
      return;
    }

    setIsLoading(true);
    
    try {
      await updateEmail(newEmail);
      toast.success("Email atualizado! Verifique seu novo email para confirmar a alteração.");
      setShowEmailDialog(false);
      setNewEmail("");
    } catch (error) {
      toast.error("Erro ao atualizar email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error("Por favor, insira a nova senha.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    
    try {
      await updatePassword(newPassword);
      toast.success("Senha atualizada com sucesso!");
      setShowPasswordDialog(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Erro ao atualizar senha.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout.");
    }
  };

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
              {user.full_name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user.full_name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.full_name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Alterar Email</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
            <Lock className="mr-2 h-4 w-4" />
            <span>Alterar Senha</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para alterar email */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Email</DialogTitle>
            <DialogDescription>
              Digite seu novo endereço de email. Você receberá um email de confirmação no novo endereço.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-email">Email Atual</Label>
              <Input
                id="current-email"
                value={user.email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Novo Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="novo@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEmailDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateEmail} disabled={isLoading}>
              {isLoading ? "Atualizando..." : "Atualizar Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para alterar senha */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Digite sua nova senha. Ela deve ter pelo menos 6 caracteres.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdatePassword} disabled={isLoading}>
              {isLoading ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
