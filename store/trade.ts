import { makeAutoObservable } from "mobx";
import { FormatNumber } from "./FormatNumber";
import _ from "lodash";
import { TokenListItem } from "./types/token";

export class TradeStore {
  isShowMoreDetail: boolean = false;
  isShowSlippageModal: boolean = false;
  slippageConfig = [10, 20];
  defaultSlippage = 20;
  switchType: boolean = false;
  isOpenSelectTokenModal: boolean = false;
  keyword: string = "";
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    loading?: boolean;
  } = {
    page: 1,
    limit: 10,
    hasMore: true,
    loading: false,
  };
  fromToken: TokenListItem | null = null;
  toToken: TokenListItem | null = null;

  fromAmount = new FormatNumber({});
  toAmount = new FormatNumber({});
  amountIn: bigint = BigInt(0);
  amountOut: bigint = BigInt(0);
  amountOutMin: bigint = BigInt(0);
  amountSide: string = "";
  inputMint: string | null = null;
  outputMint: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setData(v: Partial<TradeStore>) {
    Object.assign(this, v);
  }
}
