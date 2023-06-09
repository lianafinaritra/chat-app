import { create } from 'zustand';
import {Channel} from "@/services/types/channel";
import {User} from "@/services/types";

type Store = {
    channel: Channel | null;
    allChannels: Channel[];
    friend: User | null;
};

type Action = {
    setFriend: (friend: User) => void;
    setChannel: (channel: Channel) => void;
    setChannels: (channels: Channel[]) => void;
};

export const useChannelStore = create<Store & Action>()(set => ({
    friend: null,
    channel: null,
    allChannels: [],
    setChannel: (channel) => set(({ channel })),
    setChannels: (channels) => set(({ allChannels: channels })),
    setFriend: (friend) => set(({friend}))
}));