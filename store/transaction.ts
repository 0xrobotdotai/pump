import { makeAutoObservable } from "mobx";
import { TRANSACTION } from "./types/token";
import { client } from "@/lib/subgraphClient";
import { gql } from "graphql-request";
import { AsyncState } from "./AsyncState";
import { hasuraClient } from "@/lib/hasuraClient";

export class TransactionStore {
  tabKey: string = "buy";
  isShowSlippageModal: boolean = false;
  slippageConfig = [10, 20];
  defaultSlippage = 20;

  transactionPage: number = 1;
  transactionLimit: number = 10;
  transactionTotal: number = 0;
  transactions: TRANSACTION[] = [];
  isLoading: boolean = true;
  isFilterFollowing: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setData(v: Partial<TransactionStore>) {
    Object.assign(this, v);
  }

  get hasMoreTransaction() {
    if (this.transactionTotal === 0) {
      return true;
    }

    return this.transactionPage * this.transactionLimit < this.transactionTotal;
  }

  fetchTransactionList = new AsyncState({
    value: [] as TRANSACTION[],
    action: async (mint: String) => {
      try {
        let variables: any = {
          limit: this.transactionLimit,
          offset: (this.transactionPage - 1) * this.transactionLimit,
          token: mint,
        };
        const data: { transactions: TRANSACTION[] } =
          await hasuraClient.request(
            gql`
              query ($limit: Int!, $offset: Int!, $token: bpchar) {
                transactions(
                  limit: $limit
                  offset: $offset
                  where: { token: { _eq: $token } }
                  order_by: { created_at: desc }
                ) {
                  id
                  iotxAmount: iotx_amount
                  timestamp: created_at
                  type
                  user
                  tokenAmount: token_amount
                }
              }
            `,
            variables
          );

        return data.transactions?.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp).getTime() / 1000,
        }));
      } catch (error) {
        console.error("error", error);
        return false;
      }
    },
  });
}
