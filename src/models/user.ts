
export interface CreateUser {
    email: string;
    password: string;
    name: string;
    bio?: string;
}
_
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