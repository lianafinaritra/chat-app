import { User } from '../types';
import { create } from 'zustand';

type Store = {
    user: User | null;
    allUsers: User[];
};
  
type Action = {
    setUser: (user: User) => void;
    setUsers: (users: User[]) => void;
};

export const useAuthStore = create<Store & Action>()(set => ({
    user: null,
    allUsers: [],
    setUser: (user) => set(({ user })),
    setUsers: (users) => set(({ allUsers: users }))
}));