
import { BaseEntity } from '@/shared/types/common';

export interface Proposal extends BaseEntity {
  title: string;
  client: string;
  value: number;
  status: 'rascunho' | 'enviada' | 'aceita' | 'rejeitada' | 'vencida';
  createdAt: string;
  validUntil: string;
  description?: string;
  services: ProposalService[];
}

export interface ProposalService {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateProposalData {
  title: string;
  client: string;
  description?: string;
  validUntil: Date;
  services: ProposalService[];
}

export interface UpdateProposalData extends Partial<CreateProposalData> {
  id: string;
}
