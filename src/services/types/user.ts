
export interface CreateUser {
    email: string;
    password: string;
    name: string;
    bio: string | null;
}

export interface UpdateUser {
    name: string;
    oldPassword: string;
    password: string;
    bio: string | null;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface RestUser {
    id: number;
    email: string;
    name: string;
}

export interface User {
    status: string;
    id: number;
    email: string;
    name: string;
    bio: string;
    updatedAt: string;
    createdAt: string;
    googleId?: string;
    deletedAt?: string;
    token: string;
}