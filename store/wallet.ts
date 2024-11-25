import { defaultChain } from "@/config/wagmi";
import {
  Chain,
  createPublicClient,
  http,
  createWalletClient,
  publicActions,
  custom,
  erc20Abi,
} from "viem";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { AsyncState } from "./AsyncState";
import BigNumber from "bignumber.js";
import { FormatNumber } from "./FormatNumber";
import { rootStore } from ".";
import { getContractAddress } from "@/config/public";

export class WalletStore {
  address: string = "";
  chain: Chain | undefined;
  isConnect: boolean = false;
  isOpenSignModal: boolean = false;
  updateTicker = 0;
  initLoading: boolean = false;
  signLoading: boolean = false;
  isSign: boolean = false;
  balance = new FormatNumber({});
  robaBalance = new FormatNumber({});
  inviteCode: string = "";
  coin = {
    isEther: true,
    name: "",
    symbol: "IOTX",
    imageUri: "/imgs/IOTX.png",
    balance: '0',
    usdValue: 0,
    usdUnitPrice: 0,
    mint: "",
    isComplete: true,
  };
  sign: () => void = () => {};

  constructor(args?: Partial<WalletStore>) {
    Object.assign(this, args);
  }

  setData(v: Partial<WalletStore>) {
    Object.assign(this, v);
  }

  get client() {
    return createWalletClient({
      account: this.address as `0x${string}`,
      chain: defaultChain,
      transport: http(),
    }).extend(publicActions);
  }

  get publicClient() {
    return createPublicClient({
      chain: defaultChain,
      transport: http(),
    });
  }

  get walletClient() {
    return createWalletClient({
      account: this.address as `0x${string}`,
      chain: defaultChain,
      transport: custom(window.ethereum!),
    }).extend(publicActions);
  }

  getBalance = new AsyncState({
    action:async () => {
      if(!this.address) return;
      const value = await this.publicClient.getBalance({
        address: this.address as `0x${string}`,
      });
      this.balance.setValue(new BigNumber(value.toString()))
      this.setData({ coin: {...this.coin, balance: this.balance.format, usdValue: Number(this.balance.format) * this.coin.usdUnitPrice } })
      return this.balance.format
    },
  });

  getRobaBalance = new AsyncState({
    action:async () => {
      const address = getContractAddress('RobotToken')
      const data: any = await this.publicClient.readContract({
        address: address as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [rootStore.wallet.address as `0x${string}`],
      });
      this.robaBalance.setValue(new BigNumber(data));

      return this.robaBalance;
    },
  });
}
