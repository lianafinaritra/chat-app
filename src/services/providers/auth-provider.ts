import {User, LoginUser, CreateUser, UpdateUser} from '../types';
import {request, requestToken} from "@/services/providers/utils";

export const authProvider = {
    signUp: async (newUser: CreateUser) => {
        try {
            const getUser: User = (await request().post('/users', newUser)).data.user;
            return { data: getUser, authenticate: true };
        } catch (error) {
            return { data: null as any, authenticate: false };
        }
    },
    signIn: async (user: LoginUser) => {
      try {
        const getUser: User = (await request().post('/users/login', user)).data.user;
        localStorage.setItem('accessToken', getUser.token);
          return { data: getUser, authenticate: true };
      } catch (error) {
          return { data: null as any, authenticate: false };
      }
    },
    getAllUsers: async (token: string) => {
        try {
            const allUsers: User[] = (await requestToken(token).get('/users')).data.users;
            return { data: allUsers, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    },
    updateUser: async (token: string, infos: UpdateUser) => {
        try {
            const user: User = (await requestToken(token).put('/user', infos)).data.users;
            return { data: user, check: true };
        } catch (error) {
            return { data: null as any, check: false };
        }
    },
  };