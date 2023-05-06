import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import {Inter} from "next/font/google";

export const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
  )
}
