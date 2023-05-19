import {requestToken} from "@/services/providers/utils";
import {Channel, CreateChannel} from "@/services/types/channel";
import {CreateMessage, Message} from "@/services/types/message";

export const messageProvider = {
    createMessage: async (token: string, newMessage: CreateMessage) => {
        try {
            const message: Message = (await requestToken(token).post('/message', newMessage)).data.message;
            return { data: message, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    },
    getAllMessagesByChannel: async (token: string, channelID: string) => {
        try {
            const allMessages: Message[] = (await requestToken(token).get('/messages/channel/'+channelID)).data.messages;
            return { data: allMessages, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    }
};