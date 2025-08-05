
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';

interface UserDataContextType {
  users: User[];
  addUser: (user: User) => void;
  patients: User[];
  professionals: User[];
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };
  
  const patients = users.filter((user) => user.perfil === 'paciente');
  const professionals = users.filter((user) => user.perfil === 'medico');

  return (
    <UserDataContext.Provider value={{ users, addUser, patients, professionals }}>
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
