import {requestToken} from "@/services/providers/utils";
import {Channel, CreateChannel} from "@/services/types/channel";
import {useAuthStore} from "@/services/stores/auth-store";

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
    getChannelbyId: async (token: string, channelID: string) => {
        try {
            const channel: Channel = (await requestToken(token).get('/channel/'+channelID)).data.channel;
            return { data: channel, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    },
    addMember: async (token: string, channelID: string, newMember: {members: string[]}) => {
        try {
            const member: string[] = (await requestToken(token).post('/channels/'+channelID+'/members', newMember)).data.userAdded;
            return { data: member, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    }
};