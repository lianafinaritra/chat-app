import React, {useState} from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  router.push('/login').catch((error) => {
    console.log("Error during redirection in Login Form:", error);
  });
}
