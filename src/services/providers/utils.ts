import axios from "axios";

export const baseURL = 'http://localhost:8080';

export const axiosRequest = () => {
    return axios.create({ baseURL: baseURL });
};