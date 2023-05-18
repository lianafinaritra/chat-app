import {requestToken} from "@/services/providers/utils";
import {Channel} from "@/services/types/channel";

export const ChannelProvider = {
    getChannel: async (token: string, channelID: string) => {
        try {
            const channel: Channel = (await requestToken(token).get('/channel',{
                params: {
                    channelID: channelID
                }
            })).data.channel;
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