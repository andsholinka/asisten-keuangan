"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  icon?: string;
  note: string;
  date: string;
  type: TransactionType;
}

interface UserProfile {
  name: string;
  image: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'Nama Kamu', image: '' });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('asisten_keuangan_data');
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    }
    
    const savedProfile = localStorage.getItem('asisten_keuangan_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('asisten_keuangan_data', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('asisten_keuangan_profile', JSON.stringify(userProfile));
    }
  }, [userProfile, isLoaded]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction, 
      userProfile,
      updateProfile,
      balance, 
      totalIncome, 
      totalExpense 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
