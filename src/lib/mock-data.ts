import type { User, Appointment, ElectronicHealthRecord } from './types';

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
    uid: "paciente003",
    nome: "Pedro Almeida",
    email: "pedro@paciente.com",
    perfil: "paciente",
    telefone: "11966665555",
    data_nascimento: "2001-01-15",
    endereco: "Rua da Consolação, 900, São Paulo, SP",
    criado_em: "2024-05-20T09:00:00Z"
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

export const mockHealthRecords: ElectronicHealthRecord[] = [
  {
    id: "rec001",
    pacienteId: "paciente001",
    pacienteNome: "Maria Paciente",
    profissionalId: "medico001",
    profissionalNome: "Dr. João Médico",
    data: "2024-08-15T09:00:00",
    tipo: "consulta",
    anamnese: "Paciente relata dor de cabeça persistente há 2 semanas, com piora ao final do dia. Nega febre ou outros sintomas.",
    exameFisico: "Bom estado geral, corada, hidratada. Pressão arterial 120/80 mmHg. Ausculta cardíaca e pulmonar sem alterações.",
    hipoteseDiagnostica: "Cefaleia tensional.",
    conduta: "Prescrito analgésico (Paracetamol 500mg de 6/6h se dor), orientado sobre técnicas de relaxamento e solicitado exame de sangue para descartar outras causas.",
    criado_em: "2024-08-15T09:20:00"
  },
  {
    id: "rec002",
    pacienteId: "paciente002",
    pacienteNome: "Carlos Silva",
    profissionalId: "medico002",
    profissionalNome: "Dra. Ana Dentista",
    data: "2024-08-15T10:30:00",
    tipo: "procedimento",
    anamnese: "Paciente veio para limpeza de rotina. Nega sensibilidade ou dor.",
    exameFisico: "Presença de placa bacteriana leve em dentes inferiores. Gengivas saudáveis.",
    hipoteseDiagnostica: "Profilaxia.",
    conduta: "Realizada limpeza de rotina (profilaxia) e aplicação de flúor. Orientado sobre higiene bucal.",
    criado_em: "2024-08-15T11:00:00"
  },
  {
    id: "rec003",
    pacienteId: "paciente001",
    pacienteNome: "Maria Paciente",
    profissionalId: "medico002",
    profissionalNome: "Dra. Ana Dentista",
    data: "2024-08-16T14:00:00",
    tipo: "exame",
    anamnese: "Paciente realizou Raio-X panorâmico solicitado para avaliação geral.",
    exameFisico: "N/A",
    hipoteseDiagnostica: "Avaliação de rotina.",
    conduta: "Raio-X panorâmico da arcada dentária não mostrou cáries ou outras anormalidades. Retorno em 6 meses.",
    criado_em: "2024-08-16T14:30:00"
  },
];
