import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

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
  }, []);
}
