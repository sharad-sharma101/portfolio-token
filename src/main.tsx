import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { StrictMode } from 'react'
import App from './AppRoute.tsx'
import './index.css'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '503d0655e6670578e8d8ea21d9834124',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, 
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </RainbowKitProvider>   
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
