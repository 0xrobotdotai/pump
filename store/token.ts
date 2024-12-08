import { AsyncState } from "./AsyncState";
import toast from "react-hot-toast";
import { rootStore } from ".";
import { erc20Abi } from "viem";
import BigNumber from "bignumber.js";
import { FormatNumber } from "./FormatNumber";
import pDebounce from "p-debounce";
import _ from "lodash";
import { InfoIcon, ChartIcon } from "@/components/icons";
import { getContract, publicConfig } from "@/config/public";
import { formatUnits, MaxUint256, parseEther } from "ethers";
import { helper } from "@/lib/helper";
import { TOKEN } from "./types/token";
import { client } from "@/lib/subgraphClient";
import { gql } from "graphql-request";
import { makeAutoObservable } from "mobx";
import { useAccount } from "wagmi";
import { defaultChain } from "@/config/wagmi";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export interface COINITEM {
  sol_amount: number;
  token_amount: number;
  user: string;
  mint: string;
  name: string;
  symbol: string;
  description: string;
  created_timestamp: number;
  market_cap: number;
  reply_count: number;
  last_reply: number;
  creator_username: string;
  image_uri: string;
  usd_market_cap: number;
}

type SwapParams = {
  amount: string;
  slippage?: {
    denominator?: number;
    numerator?: number;
  };
  recipient: `0x${string}`;
  token: `0x${string}`;
  tradeType: "BUY" | "SELL";
};

export type ConfigContext = {
  chainId: string;
  appName: string;
  authData?: Record<string, any>;
};

export class TokenStore {
  tabKey = "buy" as "buy" | "sell";
  isLoading: boolean = true;
  debounceUpdatePrice = pDebounce(this.updateTokenAmout, 500);
  debounceUpdatePriceWithoutPromise = _.debounce(this.updateTokenAmout, 500);
  isShowMore: boolean = false;
  isOpenConfirmModal: boolean = false;
  isOpenCreateModal: boolean = false;
  balance = new FormatNumber({});
  detail: TOKEN | null = null;
  createForm = {
    name: "",
    symbol: "",
    description: "",
    image: "",
    twitter: "",
    telegram: "",
    website: "",
    address: "" as `0x${string}` | null,
  };
  buyTokenValue: string = "";
  sellTokenValue: string = "";
  buyAmount = new FormatNumber({});
  ETH_DECIMAL: number = 18;
  TOKEN_DECIMAL: number = 18;
  TOKEN_DECIMAL_SIZE = Math.pow(10, this.TOKEN_DECIMAL);
  ETH_DECIMAL_SIZE = Math.pow(10, this.ETH_DECIMAL);
  buyPayData = {
    tokenAmount: { format: 0, value: BigInt(0) },
    ethAmount: { format: 0, value: BigInt(0) },
    maxEthCost: { format: 0, value: BigInt(0) },
    minEthOutput: { format: 0, value: BigInt(0) },
    isEnough: true,
  };

  switchType: boolean = false; // false: eth to Token, true: Token to eth
  mobileTabKey: string = "info";
  mobileTabs = [
    {
      key: "info",
      label: "Info",
      icon: InfoIcon,
    },
    {
      key: "chart",
      label: "Chart",
      icon: ChartIcon,
    },
    {
      key: "buy-sell",
      label: "Buy/Sell",
      icon: "pixelarticons:sync",
    },
    {
      key: "trades",
      label: "Trades",
      icon: "pixelarticons:list-box",
    },
  ];

  tradeState = {
    name: "Place Trade",
    isValid: true,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setData(v: Partial<TokenStore>) {
    Object.assign(this, v);
  }

  get trade() {
    return rootStore.trade;
  }

  get wallet() {
    return rootStore.wallet;
  }

  get RobotPadContract() {
    return getContract("RobotPad");
  }

  get RobotTokenContract() {
    return getContract("RobotToken");
  }

  get quantityToken() {
    if (!this.buyAmount || this.buyAmount?.format === "") return "...";
    return helper.number.wrapNumber(this.calcPrice.value?.quote || "0", 18, { format: "0.00" }).format;
  }

  fetchTokenDetail = new AsyncState({
    action:async (mint: string) => {
      try {
        const data = await fetch(`${publicConfig.ROBOT_PUMP_HASURA_REST_URL}/tokendetail/${mint}`).then(res => res.json())
        const totalSupply = 1000000000000000000000000000;
        const sellTotal = 800000000000000000000000000;
        const [balanceOf] = await rootStore.wallet.publicClient.multicall({
          contracts: [
            {
              address: mint as `0x${string}`,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [rootStore.token?.RobotPadContract.address as `0x${string}`],
            },
          ],
        });

        const sellBlance = Number(balanceOf.result?.toString());

        const token = data.tokens[0];
        const formatRes = rootStore.market.fomatTokenInfo(token?.info);
        this.detail = {
          ...token,
          ...formatRes,
          progress: Math.floor(((totalSupply - sellBlance) / sellTotal) * 100),
          balance: new FormatNumber({}),
        };

        return this.detail;
      } catch (error) {
        toast.error("Get token Failed");
      } finally {
        this.isLoading = false;
      }
    },
  });

  amountChange = (address: string) => {
    this.calcPrice.execute({
      amount: this.buyAmount.value.toFixed(0),
      token: address,
      tradeType: this.tabKey === "buy" ? "BUY" : "SELL",
      slippage: {
        numerator: rootStore.trade.defaultSlippage * 100,
        denominator: 10000,
      },
    });
  };

  calcPrice = new AsyncState({
    action:async (args: {
      amount: string;
      token: string;
      slippage?: {
        denominator?: number;
        numerator?: number;
      };
      tradeType: "BUY" | "SELL";
    }) => {
      const res = await this.swapAmount({
        ...args,
        // @ts-ignore
        recipient: rootStore.wallet.address,
      });
      return res;
    },
  });

  async getBuyAmountWithFeeFun(token: string, amount: string) {
    const data: any = await rootStore.wallet.client.readContract({
      ...this.RobotPadContract,
      functionName: "getBuyAmountWithFee",
      args: [token, amount],
    });
    return data;
  }

  async getSellAmountWithFeeFun(token: string, amount: string) {
    const data: any = await rootStore.wallet.client.readContract({
      ...this.RobotPadContract,
      functionName: "getSellAmountWithFee",
      args: [token, amount],
    });
    return data;
  }

  async swapAmount(args: SwapParams, ctx?: ConfigContext) {
    try {
      const { amount, slippage, recipient, token, tradeType } = args;
      if (tradeType == "BUY") {
        const getBuyTokenAmountWithFee = await this.getBuyAmountWithFeeFun(token, amount);

        const _slippage = slippage?.numerator ? 1 - Number(slippage!.numerator) / Number(slippage!.denominator) : 1 - 0.005;
        const amountOutMin = new BigNumber(getBuyTokenAmountWithFee[1].toString()).multipliedBy(_slippage);
        return {
          quote: amountOutMin.toFixed(0),
        };
      } else {
        const getSellTokenAmountWithFee = await this.getSellAmountWithFeeFun(token, amount);
        const _slippage = slippage ? 1 - Number(slippage!.numerator) / Number(slippage!.denominator) : 1 - 0.005;
        const amountOutMin = new BigNumber(getSellTokenAmountWithFee.toString()).multipliedBy(_slippage);
        // console.log([token, amount, amountOutMin.toFixed(0), recipient]);

        return {
          quote: amountOutMin.toFixed(0),
        };
      }
    } catch (e) {
      console.error(e);
      return { error: e };
    }
  }

  tokenSellTabs = (item: number) => {
    if (item === 0) {
      this.buyAmount.setValue(new BigNumber(""));
      return false;
    }
    const value = Number(this.balance.format) || 0;
    if (value === 0) return;
    this.buyAmount.setValue(new BigNumber(this.balance.value.multipliedBy(item).toFixed(0)));
    this.amountChange(this.detail?.id ?? "");
  };

  mainTabChange = (item: number) => {
    if (item === 0) {
      this.buyAmount.setValue(new BigNumber(""));
      return false;
    }
    this.buyAmount.setFormat(`${item}`);
    this.amountChange(this.detail?.id ?? "");
  };

  updateTokenAmout() {}

  removeEmptyValues(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "") {
        delete obj[key];
      }
    });
    return obj;
  }

  resetEthAndTokenInput() {
    this.buyAmount.setValue(new BigNumber(""));
  }

  checkCreateForm() {
    const { name, symbol, description, image } = this.createForm;

    if (!name) {
      toast.error("Please enter name");
      return false;
    }
    if (!symbol) {
      toast.error("Please enter symbol");
      return false;
    }
    if (!image) {
      toast.error("Please upload image");
      return false;
    }
    return true;
  }

  getTokenAllowance = async (token: string, spender: string) => {
    const data: any = await rootStore.wallet.client.readContract({
      address: token as `0x${string}`,
      abi: erc20Abi,
      functionName: "allowance",
      args: [rootStore.wallet.address as `0x${string}`, spender as `0x${string}`],
    });
    return data;
  };

  approveToken = async (token: string, spender: string, amount: bigint) => {
    const allowance = await this.getTokenAllowance(token, spender);
    if (allowance && new BigNumber(allowance).gt(10)) return true;

    const { request } = await rootStore.wallet.client.simulateContract({
      address: token as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender as `0x${string}`, amount],
    });
    const txid = await rootStore.wallet.walletClient.writeContract(request);

    const receipt = await rootStore.wallet.walletClient.waitForTransactionReceipt({
      hash: txid,
    });

    return receipt;
  };

  getAmountsOut = async (tokenIn: string, tokenOut: string, amountIn: bigint) => {
    // const data: any = await rootStore.wallet.client.readContract({
    //   ...publicConfig.contract,
    //   functionName: "getAmountsOut",
    //   args: [tokenIn, tokenOut, amountIn],
    // });
    // return data[1];
  };

  getTokenDecimals = async (token: string) => {
    const data: any = await rootStore.wallet.client.readContract({
      address: token as `0x${string}`,
      abi: erc20Abi,
      functionName: "decimals",
    });
    return data;
  };

  resetCreateForm() {
    this.createForm = { name: "", symbol: "", description: "", image: "", twitter: "", telegram: "", website: "", address: null };
  }

  createCoinFun = new AsyncState({
    action:async () => {
      const isValid = this.checkCreateForm();
      if (isValid) {
        this.setData({ isOpenConfirmModal: true });
      }
    },
  });

  createTokenAndBuy = new AsyncState({
    action:async () => {
      await this.approveToken(this.RobotTokenContract.address, this.RobotPadContract.address, MaxUint256);
      const { name, symbol, description, image, twitter, telegram, website } = this.createForm;
      const _projectInfo = { description, image, name, symbol, twitter, telegram, website };

      const data = await rootStore.wallet.client.simulateContract({
        ...this.RobotPadContract,
        functionName: "create",
        args: [name, symbol, rootStore.wallet.address, JSON.stringify(_projectInfo)],
        value: this.buyAmount.value ? BigInt(this.buyAmount.value.toFixed(0)) : BigInt(0),
      });
      const txid = await rootStore.wallet.walletClient.writeContract(data.request);

      const receipt = await rootStore.wallet.walletClient.waitForTransactionReceipt({
        hash: txid,
        confirmations: 8,
      });
      toast.success("Create token success!");
      rootStore.wallet.getBalance.execute();
      rootStore.wallet.getRobaBalance.execute();
      return data.result as `0x${string}`;
    },
  });

  getTokenBalanceWeb3 = new AsyncState({
    action:async (tokenMintAddress: string) => {
      if (!tokenMintAddress || !rootStore.wallet.address) return false;
      const data: any = await rootStore.wallet.publicClient.readContract({
        address: tokenMintAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [rootStore.wallet.address as `0x${string}`],
      });
      this.balance.setValue(new BigNumber(data));
      return this.balance;
    },
  });

  getHolderDistribution = new AsyncState({
    value: [],
    action:async (tokenMintAddress: string) => {
      // const res = await getHolderRank({
      //   mint: tokenMintAddress,
      // });
      // console.log("holderData", res);
      // return res.data || [];
    },
  });

  confirmClick = new AsyncState({
    action:async () => {
      if (!this.detail) return;
      if (this.tabKey === "buy") {
        const { id } = this.detail;
        const data = await rootStore.wallet.client.simulateContract({
          ...this.RobotPadContract,
          functionName: "buy",
          args: [id, this.calcPrice.value?.quote?.toString(), rootStore.wallet.address],
          value: parseEther(`${this.buyAmount.format}`),
        });
        const txid = await rootStore.wallet.walletClient.writeContract(data.request);

        const receipt = await rootStore.wallet.walletClient.waitForTransactionReceipt({
          hash: txid,
        });
        if (receipt.status === "success") {
          this.resetEthAndTokenInput();
          Promise.all([this.fetchTokenDetail.execute(this.detail.id), rootStore.wallet.getBalance.execute(), this.getTokenBalanceWeb3.execute(this.detail.id), rootStore.transaction.fetchTransactionList.execute(this.detail.id)]);
        }
        return true;
      } else {
        await this.approveToken(this.detail.id, this.RobotPadContract.address, MaxUint256);
        const data = await rootStore.wallet.client.simulateContract({
          ...this.RobotPadContract,
          functionName: "sell",
          args: [this.detail.id, BigInt(this.buyAmount.value.toFixed(0)), this.calcPrice.value?.quote?.toString(), rootStore.wallet.address, rootStore.wallet.address],
        });
        const txid = await rootStore.wallet.walletClient.writeContract(data.request);

        const receipt = await rootStore.wallet.walletClient.waitForTransactionReceipt({
          hash: txid,
        });
        if (receipt.status === "success") {
          this.resetEthAndTokenInput();
          Promise.all([this.fetchTokenDetail.execute(this.detail.id), rootStore.wallet.getBalance.execute(), this.getTokenBalanceWeb3.execute(this.detail.id), rootStore.transaction.fetchTransactionList.execute(this.detail.id)]);
        }
        return true;
      }
    },
  });

  launchToken = new AsyncState({
    action:async (address: string) => {
      const data = await rootStore.wallet.client.simulateContract({
        ...this.RobotPadContract,
        functionName: "launch",
        args: [address],
      });
      const txid = await rootStore.wallet.walletClient.writeContract(data.request);
      // console.log("txid", txid, data);

      const receipt = await rootStore.wallet.walletClient.waitForTransactionReceipt({
        hash: txid,
        confirmations: 5,
      });
      toast.success("Launch token success: " + txid);
      this.fetchTokenDetail.execute(address);
      return true;
    },
  });

  gas = new AsyncState({
    action:async () => {
      const gas = await rootStore.wallet.walletClient.estimateContractGas({
        ...this.RobotPadContract,
        functionName: "create",
        args: ["", "", rootStore.wallet.address, ""],
        value: BigInt(0),
      });
      return formatUnits(gas.toString(), "ether");
    },
  });
}
