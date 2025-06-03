
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockProposals } from "@/data/mockProposals";
import type { Contract } from "@/data/mockContracts";

const contractSchema = z.object({
  proposalId: z.string().optional(),
  client: z.string().min(1, "Cliente é obrigatório"),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.number().min(0, "Valor deve ser positivo"),
  status: z.enum(['ativo', 'concluido', 'cancelado', 'pausado']),
  startDate: z.date(),
  endDate: z.date(),
  services: z.array(z.string()).min(1, "Selecione pelo menos um serviço"),
  paymentTerms: z.string().min(1, "Termos de pagamento são obrigatórios")
});

type ContractFormData = z.infer<typeof contractSchema>;

interface ContractFormProps {
  contract?: Contract;
  onSubmit: (data: ContractFormData) => void;
  isLoading?: boolean;
}

export function ContractForm({ contract, onSubmit, isLoading }: ContractFormProps) {
  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      proposalId: contract?.proposalId || "",
      client: contract?.client || "",
      title: contract?.title || "",
      description: contract?.description || "",
      value: contract?.value || 0,
      status: contract?.status || 'ativo',
      startDate: contract?.startDate ? new Date(contract.startDate) : undefined,
      endDate: contract?.endDate ? new Date(contract.endDate) : undefined,
      services: contract?.services || [],
      paymentTerms: contract?.paymentTerms || ""
    }
  });

  const acceptedProposals = mockProposals.filter(proposal => proposal.status === 'aceita');

  const handleProposalSelect = (proposalId: string) => {
    const selectedProposal = acceptedProposals.find(p => p.id === proposalId);
    if (selectedProposal) {
      form.setValue('client', selectedProposal.client);
      form.setValue('title', selectedProposal.title);
      form.setValue('description', selectedProposal.description);
      form.setValue('value', selectedProposal.value);
      form.setValue('services', selectedProposal.services);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="proposalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Importar de Proposta Aceita</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  handleProposalSelect(value);
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma proposta aceita" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {acceptedProposals.map((proposal) => (
                      <SelectItem key={proposal.id} value={proposal.id}>
                        {proposal.client} - {proposal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do contrato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição detalhada do contrato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Término</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => form.getValues("startDate") && date < form.getValues("startDate")}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Termos de Pagamento</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: 50% entrada, 50% na entrega" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : contract ? "Atualizar" : "Criar"} Contrato
          </Button>
        </div>
      </form>
    </Form>
  );
}
