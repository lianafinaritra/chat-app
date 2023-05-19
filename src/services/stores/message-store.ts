import { create } from 'zustand';
import {Channel} from "@/services/types/channel";
import {Message} from "@/services/types/message";

type Store = {
    allMessages: Message[];
};

type Action = {
    setMessages: (messages: Message[]) => void;
};

export const useChannelStore = create<Store & Action>()(set => ({
    allMessages: [],
    setMessages: (messages) => set(({ allMessages: messages }))
}));