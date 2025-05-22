
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ClientForm, { ClientFormValues } from "@/components/clients/ClientForm";

const NewClient = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: ClientFormValues) => {
    console.log("Novo cliente:", data);
    toast.success("Cliente cadastrado com sucesso!");
    navigate("/clientes");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Novo Cliente</h1>
      </div>
      
      <ClientForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewClient;
