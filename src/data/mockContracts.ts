
export interface Contract {
  id: string;
  proposalId: string;
  client: string;
  title: string;
  description: string;
  value: number;
  status: 'ativo' | 'concluido' | 'cancelado' | 'pausado';
  startDate: string;
  endDate: string;
  signedAt: string;
  services: string[];
  paymentTerms: string;
}

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
    services: ['Desenvolvimento Web', 'E-commerce', 'Integração de Pagamentos'],
    paymentTerms: '50% entrada, 50% na entrega'
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
    services: ['Desenvolvimento Web', 'Design UI/UX'],
    paymentTerms: '30% entrada, 70% na entrega'
  }
];
