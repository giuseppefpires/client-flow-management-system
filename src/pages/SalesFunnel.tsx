import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Phone, Mail, MessageCircle, Calendar } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface Client {
  id: string;
  name: string;
  company: string;
  value: string;
  date: string;
  avatar?: string;
  interactions?: {
    type: string;
    date: string;
    content: string;
  }[];
}

interface Column {
  id: string;
  title: string;
  description: string;
  clientIds: string[];
}

const initialData: {
  clients: Record<string, Client>;
  columns: Record<string, Column>;
  columnOrder: string[];
} = {
  clients: {
    'client-1': {
      id: 'client-1',
      name: 'João Silva',
      company: 'Tech Solutions',
      value: 'R$ 25.000',
      date: '12/05/2024',
      interactions: [
        { type: 'call', date: '10/05/2024', content: 'Primeiro contato, cliente interessado' },
        { type: 'email', date: '11/05/2024', content: 'Envio de material informativo' }
      ]
    },
    'client-2': {
      id: 'client-2',
      name: 'Maria Oliveira',
      company: 'Construções SA',
      value: 'R$ 45.000',
      date: '15/05/2024',
      interactions: [
        { type: 'meeting', date: '09/05/2024', content: 'Reunião inicial para entender necessidades' },
      ]
    },
    'client-3': {
      id: 'client-3',
      name: 'Carlos Mendes',
      company: 'Distribuidora Norte',
      value: 'R$ 32.000',
      date: '18/05/2024',
    },
    'client-4': {
      id: 'client-4',
      name: 'Ana Torres',
      company: 'Global Services',
      value: 'R$ 18.500',
      date: '05/05/2024',
      interactions: [
        { type: 'whatsapp', date: '04/05/2024', content: 'Cliente solicitou proposta detalhada' },
      ]
    },
    'client-5': {
      id: 'client-5',
      name: 'Roberto Alves',
      company: 'Indústria Sul',
      value: 'R$ 56.000',
      date: '22/05/2024',
    },
    'client-6': {
      id: 'client-6',
      name: 'Camila Costa',
      company: 'Consultoria Inovare',
      value: 'R$ 29.800',
      date: '19/05/2024',
    },
    'client-7': {
      id: 'client-7',
      name: 'Lucas Ferreira',
      company: 'XYZ Tecnologia',
      value: 'R$ 35.200',
      date: '25/05/2024',
      interactions: [
        { type: 'call', date: '20/05/2024', content: 'Follow-up sobre necessidades específicas' },
      ]
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Contato Inicial',
      description: '3 clientes',
      clientIds: ['client-1', 'client-4', 'client-7'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Proposta',
      description: '2 clientes',
      clientIds: ['client-2', 'client-5'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Contrato',
      description: '1 cliente',
      clientIds: ['client-3'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Serviço',
      description: '1 cliente',
      clientIds: ['client-6'],
    },
    'column-5': {
      id: 'column-5',
      title: 'Finalizado',
      description: '0 clientes',
      clientIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
};

const SalesFunnel = () => {
  const [data, setData] = useState(initialData);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type: "call",
    date: format(new Date(), "dd/MM/yyyy"),
    time: format(new Date(), "HH:mm"),
    content: ""
  });
  
  const handleAddInteraction = () => {
    if (!selectedClient) return;
    if (!newInteraction.content.trim()) {
      toast.error("Por favor, adicione uma descrição para a interação");
      return;
    }
    
    const updatedClient = { 
      ...selectedClient,
      interactions: [
        ...(selectedClient.interactions || []),
        {
          type: newInteraction.type,
          date: `${newInteraction.date} ${newInteraction.time}`,
          content: newInteraction.content
        }
      ]
    };
    
    const updatedData = {
      ...data,
      clients: {
        ...data.clients,
        [selectedClient.id]: updatedClient
      }
    };
    
    setData(updatedData);
    setSelectedClient(updatedClient);
    setNewInteraction({
      type: "call",
      date: format(new Date(), "dd/MM/yyyy"),
      time: format(new Date(), "HH:mm"),
      content: ""
    });
    setDialogOpen(false);
    toast.success("Interação adicionada com sucesso!");
  };
  
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination, or if dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const sourceColumn = data.columns[source.droppableId];
    const destColumn = data.columns[destination.droppableId];
    
    // If dropped in the same column
    if (sourceColumn === destColumn) {
      const newClientIds = Array.from(sourceColumn.clientIds);
      newClientIds.splice(source.index, 1);
      newClientIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        clientIds: newClientIds,
        description: `${newClientIds.length} ${newClientIds.length === 1 ? 'cliente' : 'clientes'}`
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    // Moving from one column to another
    const sourceClientIds = Array.from(sourceColumn.clientIds);
    sourceClientIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      clientIds: sourceClientIds,
      description: `${sourceClientIds.length} ${sourceClientIds.length === 1 ? 'cliente' : 'clientes'}`
    };

    const destClientIds = Array.from(destColumn.clientIds);
    destClientIds.splice(destination.index, 0, draggableId);
    const newDestColumn = {
      ...destColumn,
      clientIds: destClientIds,
      description: `${destClientIds.length} ${destClientIds.length === 1 ? 'cliente' : 'clientes'}`
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      },
    };

    toast.success(`Cliente movido para ${destColumn.title}!`);
    setData(newState);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-green-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Funil de Vendas</h1>
        <div>
          <Button asChild>
            <Link to="/clientes/novo">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Cliente
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="overflow-auto pb-4">
            <div className="min-w-[40rem]">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4">
                  {data.columnOrder.map((columnId) => {
                    const column = data.columns[columnId];
                    const clients = column.clientIds.map(clientId => data.clients[clientId]);
                    
                    return (
                      <div key={column.id} className="flex-1 min-w-60">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between">
                              <span>{column.title}</span>
                              <Badge variant="outline">{column.clientIds.length}</Badge>
                            </CardTitle>
                            <CardDescription>{column.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-0">
                            <Droppable droppableId={column.id}>
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="p-2 min-h-40"
                                >
                                  {clients.map((client, index) => (
                                    <Draggable
                                      key={client.id}
                                      draggableId={client.id}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          onClick={() => setSelectedClient(client)}
                                          className="p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-pointer hover:border-primary transition-colors"
                                        >
                                          <div className="flex items-center gap-3">
                                            <Avatar>
                                              <AvatarImage src={client.avatar} />
                                              <AvatarFallback className="bg-primary text-white">
                                                {client.name.substring(0, 2).toUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <h4 className="font-medium text-sm">{client.name}</h4>
                                              <p className="text-xs text-muted-foreground">{client.company}</p>
                                            </div>
                                          </div>
                                          <div className="mt-2 flex justify-between text-xs">
                                            <span className="text-muted-foreground">{client.date}</span>
                                            <span className="font-medium">{client.value}</span>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </DragDropContext>
            </div>
          </div>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Histórico de Interações</CardTitle>
              <CardDescription>
                {selectedClient ? `Cliente: ${selectedClient.name}` : "Selecione um cliente para ver suas interações"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedClient ? (
                selectedClient.interactions && selectedClient.interactions.length > 0 ? (
                  <ScrollArea className="h-80 pr-4">
                    <div className="space-y-4">
                      {selectedClient.interactions.map((interaction, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-md bg-muted/40">
                          <div className="mt-0.5">
                            {getInteractionIcon(interaction.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium capitalize">{interaction.type}</span>
                              <span className="text-xs text-muted-foreground">{interaction.date}</span>
                            </div>
                            <p className="text-sm mt-1">{interaction.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    <p>Nenhuma interação registrada</p>
                  </div>
                )
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  <p>Selecione um cliente para ver o histórico</p>
                </div>
              )}
              
              {selectedClient && (
                <div className="mt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Interação
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Interação</DialogTitle>
            <DialogDescription>
              {selectedClient ? `Registrar interação com ${selectedClient.name}` : "Selecione um cliente para registrar uma interação"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="interaction-type" className="text-right font-medium text-sm">
                Tipo
              </label>
              <div className="col-span-3">
                <select
                  id="interaction-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newInteraction.type}
                  onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
                >
                  <option value="call">Ligação</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="meeting">Reunião</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="interaction-date" className="text-right font-medium text-sm">
                Data
              </label>
              <div className="col-span-3">
                <input
                  id="interaction-date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newInteraction.date}
                  onChange={(e) => setNewInteraction({ ...newInteraction, date: format(new Date(e.target.value), "dd/MM/yyyy") })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="interaction-time" className="text-right font-medium text-sm">
                Hora
              </label>
              <div className="col-span-3">
                <input
                  id="interaction-time"
                  type="time"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newInteraction.time}
                  onChange={(e) => setNewInteraction({ ...newInteraction, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="interaction-description" className="text-right font-medium text-sm">
                Descrição
              </label>
              <div className="col-span-3">
                <Textarea
                  id="interaction-description"
                  placeholder="Detalhes da interação com o cliente"
                  value={newInteraction.content}
                  onChange={(e) => setNewInteraction({ ...newInteraction, content: e.target.value })}
                  className="min-h-24"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddInteraction}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesFunnel;
