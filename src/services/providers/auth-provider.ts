import {User, CreateUser, LoginUser} from '../types';
import {axiosRequest} from "@/services/providers/utils";

export const authProvider = {
    signIn: async (createUser: LoginUser) => {
      try {
        const getUser: User = (await axiosRequest().post('/users/login', createUser)).data.user;
          return { data: getUser, authenticate: true };
      } catch (error) {
          return { data: null as any, authenticate: false };
      }
    },
  };