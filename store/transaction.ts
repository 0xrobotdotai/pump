import { makeAutoObservable } from "mobx";
import { TRANSACTION } from "./types/token";
import { client } from "@/lib/subgraphClient";
import { gql } from "graphql-request";
import { AsyncState } from "./AsyncState";

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
    action:async (mint: String) => {
      try {
        let variables: any = {
          first: this.transactionLimit,
          skip: (this.transactionPage - 1) * this.transactionLimit,
          orderBy: 'timestamp',
          orderDirection: 'desc',
          token: mint
        };
  
        const data: { transactions: TRANSACTION[] } = await client.request(
          gql`
            query ($first: Int!, $skip: Int!, $orderBy: String, $orderDirection: String, $token: String) {
              transactions(
                first: $first
                skip: $skip
                where: {token: $token}
                orderBy: timestamp
                orderDirection: desc
              ) {
                id
                iotxAmount
                timestamp
                type
                user
                tokenAmount
              }
            }
          `,
          variables
        );
  
        return data.transactions;
      } catch (error) {
        console.log('error', error)
        return false;
      }
    }
  })
}
