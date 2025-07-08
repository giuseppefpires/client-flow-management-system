
import { Contract } from '@/domains/contracts/types';

export const mockContracts: Contract[] = [
  {
    id: '1',
    proposalId: '2',
    client: 'Maria Santos',
    title: 'Sistema de E-commerce',
    description: 'Desenvolvimento de plataforma de vendas online com integração de pagamentos.',
    value: 35000,
    status: 'ativo',
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    signedAt: '2024-01-12',
    services: [
      {
        id: '1',
        name: 'Desenvolvimento Web',
        description: 'Desenvolvimento da aplicação web',
        quantity: 1,
        unitPrice: 20000,
        totalPrice: 20000
      },
      {
        id: '2',
        name: 'E-commerce',
        description: 'Funcionalidades de e-commerce',
        quantity: 1,
        unitPrice: 10000,
        totalPrice: 10000
      },
      {
        id: '3',
        name: 'Integração de Pagamentos',
        description: 'Integração com gateways de pagamento',
        quantity: 1,
        unitPrice: 5000,
        totalPrice: 5000
      }
    ],
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    id: '2',
    proposalId: '1',
    client: 'João Silva',
    title: 'Desenvolvimento de Site Institucional',
    description: 'Criação de site institucional responsivo com sistema de gestão de conteúdo.',
    value: 15000,
    status: 'concluido',
    startDate: '2023-11-01',
    endDate: '2023-12-31',
    signedAt: '2023-10-28',
    services: [
      {
        id: '1',
        name: 'Desenvolvimento Web',
        description: 'Desenvolvimento do site institucional',
        quantity: 1,
        unitPrice: 10000,
        totalPrice: 10000
      },
      {
        id: '2',
        name: 'Design UI/UX',
        description: 'Design da interface do usuário',
        quantity: 1,
        unitPrice: 5000,
        totalPrice: 5000
      }
    ],
    created_at: '2023-10-28T10:00:00Z',
    updated_at: '2023-12-31T10:00:00Z'
  }
];
