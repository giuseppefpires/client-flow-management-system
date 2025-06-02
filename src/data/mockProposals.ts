
export interface Proposal {
  id: string;
  client: string;
  title: string;
  description: string;
  value: number;
  status: 'rascunho' | 'enviada' | 'aceita' | 'rejeitada' | 'vencida';
  createdAt: string;
  validUntil: string;
  services: string[];
}

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
    services: ['Desenvolvimento Web', 'Design UI/UX']
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
    services: ['Desenvolvimento Web', 'E-commerce', 'Integração de Pagamentos']
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
    services: ['Consultoria', 'Infraestrutura']
  }
];
