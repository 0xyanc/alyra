import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react';

const { chains, provider } = configureChains(
  [hardhat],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'Mini Job DApp',
  chains
});
const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig >
  )

}
