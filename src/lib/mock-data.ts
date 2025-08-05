import type { User, Appointment } from './types';

export const mockUsers: User[] = [
  {
    uid: "admin001",
    nome: "Administrador Geral",
    email: "admin@clinica.com",
    perfil: "admin",
    criado_em: "2024-01-01T10:00:00Z"
  },
  {
    uid: "medico001",
    nome: "Dr. João Médico",
    email: "joao@clinica.com",
    perfil: "medico",
    crm_cro: "CRM-12345",
    telefone: "11987654321",
    criado_em: "2024-01-01T10:00:00Z"
  },
  {
    uid: "medico002",
    nome: "Dra. Ana Dentista",
    email: "ana@clinica.com",
    perfil: "medico",
    crm_cro: "CRO-54321",
    telefone: "11912345678",
    criado_em: "2024-01-01T10:00:00Z"
  },
  {
    uid: "paciente001",
    nome: "Maria Paciente",
    email: "maria@paciente.com",
    perfil: "paciente",
    telefone: "11999998888",
    data_nascimento: "1990-05-20",
    endereco: "Rua das Flores, 123, São Paulo, SP",
    criado_em: "2024-02-15T14:30:00Z"
  },
  {
    uid: "paciente002",
    nome: "Carlos Silva",
    email: "carlos@paciente.com",
    perfil: "paciente",
    telefone: "11977776666",
    data_nascimento: "1985-11-30",
    endereco: "Av. Paulista, 1500, São Paulo, SP",
    criado_em: "2024-03-10T11:00:00Z"
  },
  {
    uid: "recepcionista001",
    nome: "Sofia Recepcionista",
    email: "sofia@clinica.com",
    perfil: "recepcionista",
    criado_em: "2024-01-05T09:00:00Z"
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: "appt001",
    pacienteId: "paciente001",
    pacienteNome: "Maria Paciente",
    profissionalId: "medico001",
    profissionalNome: "Dr. João Médico",
    data_hora: "2024-08-15T09:00:00",
    tipo: "consulta",
    status: "agendado",
    criado_por: "recepcionista",
    confirmado: true,
    canal: "sistema"
  },
  {
    id: "appt002",
    pacienteId: "paciente002",
    pacienteNome: "Carlos Silva",
    profissionalId: "medico002",
    profissionalNome: "Dra. Ana Dentista",
    data_hora: "2024-08-15T10:30:00",
    tipo: "procedimento",
    status: "agendado",
    criado_por: "IA",
    confirmado: false,
    canal: "whatsapp"
  },
  {
    id: "appt003",
    pacienteId: "paciente001",
    pacienteNome: "Maria Paciente",
    profissionalId: "medico002",
    profissionalNome: "Dra. Ana Dentista",
    data_hora: "2024-08-16T14:00:00",
    tipo: "exame",
    status: "concluido",
    criado_por: "paciente",
    confirmado: true,
    canal: "email"
  },
  {
    id: "appt004",
    pacienteId: "paciente002",
    pacienteNome: "Carlos Silva",
    profissionalId: "medico001",
    profissionalNome: "Dr. João Médico",
    data_hora: "2024-08-17T11:00:00",
    tipo: "consulta",
    status: "cancelado",
    criado_por: "recepcionista",
    confirmado: true,
    canal: "sistema"
  }
];
