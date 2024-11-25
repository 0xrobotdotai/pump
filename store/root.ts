import { TokenStore } from "./token";
import { WalletStore } from "./wallet";
import { MarketStore } from "./market";
import { TransactionStore } from "./transaction";
import { GlobalStore } from "./global";
import { TradeStore } from "./trade";

export default class RootStore {
  wallet = new WalletStore();
  token = new TokenStore();
  market = new MarketStore();
  trade = new TradeStore();
  transaction = new TransactionStore();
  global = new GlobalStore();
}
