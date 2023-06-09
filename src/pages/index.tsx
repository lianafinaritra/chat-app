import React, {useEffect} from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const { push, pathname }  = useRouter();

  useEffect(() => {
        push('/login').catch((error) => {
          console.log("Error during redirection in Login Form:", error);
        });
  }, [pathname, push])
}
