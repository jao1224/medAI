
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers, mockAppointments, mockHealthRecords } from '@/lib/mock-data';
import type { User, Appointment, ElectronicHealthRecord } from '@/lib/types';

interface UserDataContextType {
  users: User[];
  addUser: (user: User) => void;
  patients: User[];
  professionals: User[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  records: ElectronicHealthRecord[];
  setRecords: React.Dispatch<React.SetStateAction<ElectronicHealthRecord[]>>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [records, setRecords] = useState<ElectronicHealthRecord[]>(mockHealthRecords);


  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };
  
  const patients = users.filter((user) => user.perfil === 'paciente');
  const professionals = users.filter((user) => user.perfil === 'medico');

  const value = {
    users,
    addUser,
    patients,
    professionals,
    appointments,
    setAppointments,
    records,
    setRecords,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
