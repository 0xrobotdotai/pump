import BigNumber from "bignumber.js";
import { FormatNumber } from "../FormatNumber";

export interface TOKEN {
	id: string;
	name: string;
	symbol: string;
	price: string;
	createdAt: string;
	completed: boolean;
	launchedTx?: any;
	launchedAt?: any;
	info: string;
	creator: string;
  website?: string;
  description?: string;
  twitter?: string;
  telegram?: string;
  image?: string;
  marketCap?: number;
  progress?: number;
  balance: FormatNumber,
}

export interface TokenListItem {
	tokenId?: number;
	mint: string;
	name: string;
	symbol: string;
	imageUri: string;
	balance?: string;
	usdValue?: string | number;
  isEther?: boolean;
  usdUnitPrice?: string | number;
  isComplete?: boolean;
}



export interface TRANSACTION {
  id: string;
	iotxAmount: string;
	timestamp: string;
	type: string;
	user: string;
	tokenAmount: string;
}