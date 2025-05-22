
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ClientForm, { ClientFormValues } from "@/components/clients/ClientForm";
import { mockClients } from "@/data/mockClients";

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const client = mockClients.find(client => client.id === Number(id));
    
    if (client) {
      // Transform the mock client data to match the form structure
      const formData: ClientFormValues = {
        name: client.name,
        razaoSocial: client.razaoSocial,
        nomeFantasia: client.name, // Using name as a placeholder
        cpfCnpj: client.cnpj,
        categoria: "cliente", // Default value
        contratoAtivo: client.status === "Ativo" || client.status === "Contrato",
        inscricaoEstadual: "",
        inscricaoMunicipal: "",
        dataCadastro: client.createdAt,
        emailCobranca: "financeiro@" + client.name.toLowerCase().replace(/\s/g, "") + ".com",
        emailMedicao: "medicao@" + client.name.toLowerCase().replace(/\s/g, "") + ".com",
        diaMedicao: "1", // Default value
        tipoPagamento: "boleto", // Default value
        tipoPrazoPagamento: "prazo", // Default value
        prazoPagamento: "30", // Default value
        categoriaImposto: "simplesNacional", // Default value
        issRetidoFonte: false, // Default value
        retencaoCofinsCSLLPis: false, // Default value
        retencaoIr: false, // Default value
        retencaoInss: false, // Default value
        issPersonalizado: false, // Default value
        icmsCst: "", // Default value
        icmsAliquota: "", // Default value
        icmsCson: "", // Default value
        icmsSimplesAliquota: "", // Default value
        contatoOperacional: "Contato " + client.name,
        emailOperacional: "contato@" + client.name.toLowerCase().replace(/\s/g, "") + ".com",
        telefoneOperacional: "(11) 99999-9999", // Default value
        enviarLembrete: "email", // Default value
        bmDiario: false, // Default value
        agruparItensCompra: false, // Default value
        emiteBoletoAutomatico: false, // Default value
        emiteCertificadoAutomatico: false, // Default value
        emiteFaturaAutomatica: false, // Default value
        emiteNotaAutomatica: false, // Default value
        enviaFaturamentoAutomatico: false, // Default value
        enviaFaturamentoWhatsapp: false, // Default value
        emiteNotaAposPagamento: false, // Default value
        separaFaturamentoPorGeradora: false, // Default value
        idIntegracao: "", // Default value
        cidade: client.city,
        estado: client.state,
        cep: "00000-000", // Default value
        bairro: "Centro", // Default value
        logradouro: "Rua Principal", // Default value
        complemento: "", // Default value
        latitude: "", // Default value
        longitude: "", // Default value
        bloqueado: client.status === "Inativo", // Default value
      };
      
      setClientData(formData);
    }
    
    setLoading(false);
  }, [id]);

  const handleSubmit = (data: ClientFormValues) => {
    console.log("Cliente atualizado:", data);
    toast.success("Cliente atualizado com sucesso!");
    navigate("/clientes");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>;
  }

  if (!clientData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Cliente não encontrado</h2>
        <button 
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          onClick={() => navigate("/clientes")}
        >
          Voltar para Lista de Clientes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Editar Cliente</h1>
      </div>
      
      <ClientForm 
        defaultValues={clientData} 
        onSubmit={handleSubmit} 
        isEditing={true}
      />
    </div>
  );
};

export default EditClient;
