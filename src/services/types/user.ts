
export interface CreateUser {
    email: string;
    password: string;
    name: string;
    bio?: string;
}

export interface LoginUser {
    email: string;
    password: string;
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