import axios from "axios";
import {useAuthStore} from "@/services/stores/auth-store";

export const baseURL = 'http://localhost:8080';

export const requestToken = (token: string) => {
    const instance = axios.create({
        baseURL: baseURL,
    });

    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return instance;
};

export const request = () => {
    return axios.create({ baseURL: baseURL });
};