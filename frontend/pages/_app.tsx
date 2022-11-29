import { useState } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import axios from "axios";
import https from "https"
import { SSRProvider } from "@react-aria/ssr";

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RecoilRoot } from "recoil";

if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
  axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
}
export default function App({ Component, pageProps }: AppProps) {
  
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SSRProvider>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </RecoilRoot>
    </SSRProvider>
  );
}
