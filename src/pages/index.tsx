import React, {useEffect} from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const { push, pathname }  = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!pathname || pathname === '/') {
        push('/login').catch((error) => {
          console.log("Error during redirection in Login Form:", error);
        });
    } else if (!accessToken) {
      if (pathname === '/chat') {
        push('/login').catch((error) => {
          console.log("Error during redirection to Login:", error);
        });
      }
    } else {
      push('/chat').catch((error) => {
        console.log("Error during redirection to Chat:", error);
      });
    }
  }, [pathname, push]);
}
