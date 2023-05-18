import {requestToken} from "@/services/providers/utils";
import {Channel, CreateChannel} from "@/services/types/channel";

export const channelProvider = {
    createChannel: async (token: string, newChannel: CreateChannel) => {
        try {
            const channel: Channel = (await requestToken(token).post('/channel', newChannel)).data.channel;
            return { data: channel, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    },
    getChannel: async (token: string, channelID: string) => {
        try {
            const channel: Channel = (await requestToken(token).get('/channel/'+channelID)).data.channel;
            return { data: channel, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    },
    getAllChannels: async (token: string) => {
        try {
            const allChannels: Channel[] = (await requestToken(token).get('/channels')).data.channels;
            return { data: allChannels, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    },
};