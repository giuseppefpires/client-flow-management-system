
export interface Transaction {
  id: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  date: string;
  contractId?: string;
  clientName?: string;
  status: 'pendente' | 'pago' | 'vencido';
  dueDate?: string;
  paymentMethod?: string;
}

export interface FinancialSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldoAtual: number;
  receitasPendentes: number;
  despesasPendentes: number;
}

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receita',
    category: 'Desenvolvimento',
    description: 'Pagamento parcial - Sistema E-commerce',
    amount: 17500,
    date: '2024-01-15',
    contractId: '1',
    clientName: 'Maria Santos',
    status: 'pago',
    paymentMethod: 'Transferência'
  },
  {
    id: '2',
    type: 'receita',
    description: 'Site Institucional - João Silva',
    category: 'Desenvolvimento',
    amount: 15000,
    date: '2024-01-10',
    contractId: '2',
    clientName: 'João Silva',
    status: 'pago',
    paymentMethod: 'PIX'
  },
  {
    id: '3',
    type: 'despesa',
    category: 'Infraestrutura',
    description: 'Hospedagem de servidores',
    amount: 450,
    date: '2024-01-20',
    status: 'pago',
    paymentMethod: 'Cartão de Crédito'
  },
  {
    id: '4',
    type: 'receita',
    category: 'Desenvolvimento',
    description: 'Segunda parcela - Sistema E-commerce',
    amount: 17500,
    date: '2024-02-15',
    contractId: '1',
    clientName: 'Maria Santos',
    status: 'pendente',
    dueDate: '2024-02-15'
  },
  {
    id: '5',
    type: 'despesa',
    category: 'Software',
    description: 'Licenças de software',
    amount: 890,
    date: '2024-01-25',
    status: 'pendente',
    dueDate: '2024-01-30'
  }
];

export const getFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
  const receitas = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const despesas = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const receitasPendentes = transactions
    .filter(t => t.type === 'receita' && t.status === 'pendente')
    .reduce((sum, t) => sum + t.amount, 0);

  const despesasPendentes = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pendente')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalReceitas: receitas,
    totalDespesas: despesas,
    saldoAtual: receitas - despesas,
    receitasPendentes,
    despesasPendentes
  };
};
