import { create } from 'zustand';
import {Channel} from "@/services/types/channel";

type Store = {
    channel: Channel | null;
    allChannels: Channel[];
};

type Action = {
    setChannel: (channel: Channel) => void;
    setChannels: (channels: Channel[]) => void;
};

export const useChannelStore = create<Store & Action>()(set => ({
    channel: null,
    allChannels: [],
    setChannel: (channel) => set(({ channel })),
    setChannels: (channels) => set(({ allChannels: channels }))
}));