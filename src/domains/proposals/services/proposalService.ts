
import { Proposal, CreateProposalData, UpdateProposalData } from '../types';
import { mockProposals } from '@/data/mockProposals';

export class ProposalService {
  private static proposals: Proposal[] = [...mockProposals];

  static async getAll(): Promise<Proposal[]> {
    return this.proposals;
  }

  static async getById(id: string): Promise<Proposal | null> {
    return this.proposals.find(p => p.id === id) || null;
  }

  static async getAccepted(): Promise<Proposal[]> {
    return this.proposals.filter(p => p.status === 'aceita');
  }

  static async create(data: CreateProposalData): Promise<Proposal> {
    const totalValue = data.services.reduce((sum, service) => sum + service.totalPrice, 0);
    
    const newProposal: Proposal = {
      id: String(Date.now()),
      ...data,
      value: totalValue,
      status: 'rascunho',
      createdAt: new Date().toISOString().split('T')[0],
      validUntil: data.validUntil.toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.proposals.unshift(newProposal);
    return newProposal;
  }

  static async update(data: UpdateProposalData): Promise<Proposal | null> {
    const index = this.proposals.findIndex(p => p.id === data.id);
    if (index === -1) return null;

    const updatedProposal = {
      ...this.proposals[index],
      ...data,
      validUntil: data.validUntil ? data.validUntil.toISOString().split('T')[0] : this.proposals[index].validUntil,
      value: data.services ? data.services.reduce((sum, service) => sum + service.totalPrice, 0) : this.proposals[index].value,
      updated_at: new Date().toISOString()
    };

    this.proposals[index] = updatedProposal;
    return updatedProposal;
  }

  static async delete(id: string): Promise<boolean> {
    const index = this.proposals.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.proposals.splice(index, 1);
    return true;
  }
}
