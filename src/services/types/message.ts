import {RestUser} from "@/services/types/user";

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    senderId: string;
    recipientId: string | null;
    channelId: string;
    sender: RestUser;
}

export interface CreateMessage {
    content: string;
    channelId: string;
    recipientId: string | null;
}