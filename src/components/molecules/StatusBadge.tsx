
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      // Proposal statuses
      rascunho: { label: 'Rascunho', variant: 'secondary' },
      enviada: { label: 'Enviada', variant: 'default' },
      aceita: { label: 'Aceita', variant: 'default' },
      rejeitada: { label: 'Rejeitada', variant: 'destructive' },
      vencida: { label: 'Vencida', variant: 'secondary' },
      
      // Contract statuses
      ativo: { label: 'Ativo', variant: 'default' },
      concluido: { label: 'Concluído', variant: 'secondary' },
      cancelado: { label: 'Cancelado', variant: 'destructive' },
      pausado: { label: 'Pausado', variant: 'secondary' },
      
      // Transaction statuses
      pago: { label: 'Pago', variant: 'default' },
      pendente: { label: 'Pendente', variant: 'secondary' },
      vencido: { label: 'Vencido', variant: 'destructive' }
    };

    return configs[status] || { label: status, variant: 'default' };
  };

  const config = getStatusConfig(status);
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
