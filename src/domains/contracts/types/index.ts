
import { BaseEntity } from '@/shared/types/common';

export interface Contract extends BaseEntity {
  title: string;
  client: string;
  value: number;
  status: 'ativo' | 'concluido' | 'cancelado' | 'pausado';
  startDate: string;
  endDate: string;
  signedAt: string;
  description?: string;
  services: ContractService[];
  proposalId?: string;
}

export interface ContractService {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateContractData {
  title: string;
  client: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  services: ContractService[];
  proposalId?: string;
}

export interface UpdateContractData extends Partial<CreateContractData> {
  id: string;
}
