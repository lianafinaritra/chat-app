import {RestUser} from "@/services/types/user";

export interface Channel {
    id: string;
    name: string;
    type: 'public' | 'private';
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner: RestUser;
}

export interface CreateChannel {
    name: string;
    type: 'public' | 'private';
    members: RestUser[];
}