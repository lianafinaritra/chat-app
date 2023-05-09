import {NextRouter} from "next/router";
import {useEffect} from "react";

export default function Authentication(router: NextRouter, login: boolean){
    useEffect(() => {
        const checkLocalStorage = () => {
            const data = window.localStorage.getItem('myInformation');

            return data;
        };

        const isDataPresent = checkLocalStorage();

        if (isDataPresent) {
            router.push('/chat').catch((error) => {
                console.log("Error during redirection:", error);
            });
        } else {
            router.push('/login').catch((error) => {
                console.log("Error during redirection:", error);
            });
        }
    }, [login]);
}