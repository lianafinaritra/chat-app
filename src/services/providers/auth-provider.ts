import {User, LoginUser} from '../types';
import {request, requestToken} from "@/services/providers/utils";
import {Channel} from "@/services/types/channel";

export const authProvider = {
    signIn: async (newUser: LoginUser) => {
      try {
        const getUser: User = (await request().post('/users/login', newUser)).data.user;
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
  };