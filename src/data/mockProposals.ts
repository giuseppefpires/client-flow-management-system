
import { Proposal } from '@/domains/proposals/types';

export const mockProposals: Proposal[] = [
  {
    id: '1',
    client: 'João Silva',
    title: 'Desenvolvimento de Site Institucional',
    description: 'Criação de site institucional responsivo com sistema de gestão de conteúdo.',
    value: 15000,
    status: 'enviada',
    createdAt: '2024-01-15',
    validUntil: '2024-02-15',
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
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    client: 'Maria Santos',
    title: 'Sistema de E-commerce',
    description: 'Desenvolvimento de plataforma de vendas online com integração de pagamentos.',
    value: 35000,
    status: 'aceita',
    createdAt: '2024-01-10',
    validUntil: '2024-02-10',
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
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    client: 'Empresa ABC',
    title: 'Consultoria em TI',
    description: 'Consultoria para modernização da infraestrutura de TI.',
    value: 8000,
    status: 'rascunho',
    createdAt: '2024-01-20',
    validUntil: '2024-02-20',
    services: [
      {
        id: '1',
        name: 'Consultoria',
        description: 'Consultoria especializada em TI',
        quantity: 1,
        unitPrice: 5000,
        totalPrice: 5000
      },
      {
        id: '2',
        name: 'Infraestrutura',
        description: 'Análise e modernização da infraestrutura',
        quantity: 1,
        unitPrice: 3000,
        totalPrice: 3000
      }
    ],
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  }
];
