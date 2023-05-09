import React, {useState} from 'react';
import { useRouter } from 'next/router';
import Authentication from "@/pages/Authentication";

export default function Home() {
  const router = useRouter();
  const [login, setLogin] = useState(false);
  Authentication(router, login);
}
