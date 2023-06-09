import Head from 'next/head'
import loginStyle from '@/styles/Login.module.css'
import {Button} from "@chakra-ui/button";
import Image from 'next/image';
import img from './logo.png';
import {useForm} from "react-hook-form";
import {inter} from "@/pages/_app";
import {palette} from "@/theme/palette";
import {useRouter} from "next/router";
import {authProvider} from "@/services/providers/auth-provider";
import {LoginUser} from "@/services/types";
import { useAuthStore } from '@/services/stores/auth-store';
import {Text, useToast} from "@chakra-ui/react";

export default function Login() {
    const toast = useToast();
    const formDefaultValues: LoginUser = {
        email: '',
        password: '',
    };

    const { register, handleSubmit, formState } = useForm<LoginUser>({
        defaultValues: formDefaultValues
    });
    const { setUser } = useAuthStore();
    const router = useRouter();

    const onSubmit = (infos: LoginUser) => {
        const login = async () => {
            const { data, authenticate } = await authProvider.signIn(infos);
            if (authenticate) {
                setUser(data);
                toast({
                    title: 'Authentifié',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                localStorage.setItem('accessToken', data.token);
                await router.push('/profile');
            } else {
                toast({
                    title: 'Erreur',
                    description: 'Veuillez vérifié vos identifiants',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        };
        login();
    };

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={`${loginStyle.main} ${inter.className}`}>
                <div className={loginStyle.container}>
                    <form className={loginStyle.form}>
                        <div className={loginStyle.formContainer}>
                            <div className="relative z-0 w-3/5 mx-auto mb-7 group">
                            <input type="email" id="floating_email"
                                   className="block py-2.5 px-0 w-full text-sm text-gray-400 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-600 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                   placeholder=" " required {...register("email")}/>
                            <label htmlFor="floating_email"
                                   className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email
                                </label>
                        </div>
                            <div className="relative z-0 w-3/5 mx-auto mb-7 group">
                            <input type="password" id="floating_password"
                                   className="block py-2.5 px-0 w-full text-sm text-gray-400 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-600 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                   placeholder=" " required {...register("password")}/>
                            <label htmlFor="floating_password"
                                   className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mot de passe</label>
                        </div>
                            <div className={loginStyle.submit}>
                            <Button
                                mt={1}
                                colorScheme='teal'
                                type='submit'
                                className="loginButton"
                                isLoading={formState.isSubmitting}
                                onClick={handleSubmit(onSubmit)}
                                style={{ backgroundColor: palette.primaryPurple, fontSize: '14px', color: 'white', marginBlock: 'auto', width: '40%', borderRadius: '50px', marginLeft: '30%', boxShadow: "0 0 7px 7px rgba(170, 119, 255, 0.5)"}}
                            >
                                Se connecter
                            </Button>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <Text fontSize='sm' color='white' onClick={() => router.push('/sign-up')}>Creer un compte ?</Text>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className={loginStyle.presentation}>
                        <Image src={img} alt="Logo" style={{ width: '700px', height: '400px'}}/>
                    </div>
                </div>
            </main>
        </>
    )
}
