import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { iotex, iotexTestnet } from "viem/chains";
import { injectedWallet, metaMaskWallet, iopayWallet, okxWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { http } from "wagmi";

export const defaultChain = iotex;

const isPc = () => {
  const userAgentInfo = global?.navigator?.userAgent;
  const Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo?.indexOf(Agents[v] || "") > 0) {
      flag = false;
      break;
    }
  }
  return flag;
};


export default getDefaultConfig({
  appName: "Robot Pump",
  projectId: "e53ac23d6461a01eb88692e71a511fed",
  chains: [defaultChain],
  ssr: true,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [iopayWallet, injectedWallet, metaMaskWallet, okxWallet, walletConnectWallet],
    },
  ],
  transports: {
    [defaultChain.id]: http(),
  },
});
