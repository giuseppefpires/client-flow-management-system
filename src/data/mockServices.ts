
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  unit: 'hora' | 'projeto' | 'mes' | 'ano';
  estimatedHours?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Desenvolvimento Web',
    description: 'Desenvolvimento de sites e aplicações web responsivas.',
    category: 'Desenvolvimento',
    basePrice: 150,
    unit: 'hora',
    estimatedHours: 40,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Design UI/UX',
    description: 'Criação de interfaces de usuário e experiência do usuário.',
    category: 'Design',
    basePrice: 80,
    unit: 'hora',
    estimatedHours: 20,
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'E-commerce Completo',
    description: 'Desenvolvimento de loja virtual completa com integração de pagamentos.',
    category: 'E-commerce',
    basePrice: 5000,
    unit: 'projeto',
    estimatedHours: 80,
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '4',
    name: 'Consultoria em TI',
    description: 'Consultoria especializada em tecnologia da informação.',
    category: 'Consultoria',
    basePrice: 200,
    unit: 'hora',
    estimatedHours: 8,
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
];
