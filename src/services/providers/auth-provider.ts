import { User, CreateUser } from '../types';

export const authProvider = {
    signUp: async (user: CreateUser) => publicRequest().post('/users', user),
    signIn: async (user: User) => {
      try {
        const restUser: RestUser = (await publicRequest().post('/users/login', user)).data;
        cache.accessToken(restUser.token);
        return { redirection: '/board', data: restUser as DomainUser, authenticate: true };
      } catch (error) {
        const {
          response: { status, data },
        } = error as any;
  
        return { redirection: `/error?code=${status}`, data, authenticate: false };
      }
    },
  };