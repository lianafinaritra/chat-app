import { create } from 'zustand';
import {Message} from "@/services/types/message";

type Store = {
    allMessages: Message[];
};

type Action = {
    setMessages: (messages: Message[]) => void;
};

export const useMessageStore = create<Store & Action>()(set => ({
    allMessages: [],
    setMessages: (messages) => set(({ allMessages: messages }))
}));