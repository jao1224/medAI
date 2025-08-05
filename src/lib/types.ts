export type UserProfile = "admin" | "medico" | "paciente" | "recepcionista" | "agenteIA";

export interface User {
  uid: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  data_nascimento?: string;
  endereco?: string;
  crm_cro?: string;
  perfil: UserProfile;
  criado_em?: string;
}

export interface Appointment {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  profissionalId: string;
  profissionalNome: string;
  data_hora: string; // Using string for simplicity
  tipo: "consulta" | "exame" | "procedimento";
  status: "agendado" | "concluido" | "cancelado";
  criado_por: "recepcionista" | "IA" | "paciente";
  confirmado: boolean;
  reagendado_para?: string;
  canal: "whatsapp" | "email" | "sistema";
}

export interface ElectronicHealthRecord {
  id: string;
  pacienteId: string;
  profissionalId: string;
  descricao: string;
  tipo: "consulta" | "exame" | "procedimento";
  laudos: string[];
  data: string; // Using string for simplicity
  visivel_para: string[];
  criado_em: string;
}

export interface FinancialRecord {
  id: string;
  pacienteId: string;
  profissionalId: string;
  valor: number;
  forma_pagamento: "pix" | "cartao" | "dinheiro";
  status: "pago" | "pendente" | "cancelado";
  data_pagamento: string; // Using string for simplicity
  referente: "consulta" | "procedimento" | "outro";
  criado_em: string;
}

export interface AiLog {
  id: string;
  usuarioId: string;
  mensagem_usuario: string;
  resposta_ia: string;
  intencao_detectada: "agendamento" | "duvida" | "info" | "outro";
  canal: "whatsapp" | "chat" | "email";
  data: string; // Using string for simplicity
}
