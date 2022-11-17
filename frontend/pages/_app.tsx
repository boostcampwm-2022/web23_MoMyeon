import { useState } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

import {SSRProvider} from "@react-aria/ssr";

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RecoilRoot } from "recoil";

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
