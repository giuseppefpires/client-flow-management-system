
import { Contract, CreateContractData, UpdateContractData } from '../types';
import { mockContracts } from '@/data/mockContracts';

export class ContractService {
  private static contracts: Contract[] = [...mockContracts];

  static async getAll(): Promise<Contract[]> {
    return this.contracts;
  }

  static async getById(id: string): Promise<Contract | null> {
    return this.contracts.find(c => c.id === id) || null;
  }

  static async getActive(): Promise<Contract[]> {
    return this.contracts.filter(c => c.status === 'ativo');
  }

  static async create(data: CreateContractData): Promise<Contract> {
    const totalValue = data.services.reduce((sum, service) => sum + service.totalPrice, 0);
    
    const newContract: Contract = {
      id: String(Date.now()),
      ...data,
      value: totalValue,
      status: 'ativo',
      startDate: data.startDate.toISOString().split('T')[0],
      endDate: data.endDate.toISOString().split('T')[0],
      signedAt: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.contracts.unshift(newContract);
    return newContract;
  }

  static async update(data: UpdateContractData): Promise<Contract | null> {
    const index = this.contracts.findIndex(c => c.id === data.id);
    if (index === -1) return null;

    const updatedContract = {
      ...this.contracts[index],
      ...data,
      startDate: data.startDate ? data.startDate.toISOString().split('T')[0] : this.contracts[index].startDate,
      endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : this.contracts[index].endDate,
      value: data.services ? data.services.reduce((sum, service) => sum + service.totalPrice, 0) : this.contracts[index].value,
      updated_at: new Date().toISOString()
    };

    this.contracts[index] = updatedContract;
    return updatedContract;
  }

  static async delete(id: string): Promise<boolean> {
    const index = this.contracts.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.contracts.splice(index, 1);
    return true;
  }
}
