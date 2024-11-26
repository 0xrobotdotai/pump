import { BooleanState } from "@/lib/BooleanState";
import { makeAutoObservable } from "mobx";
import toast from "react-hot-toast";

export class AsyncState<T extends (...args: any[]) => Promise<any>, U = Awaited<ReturnType<T>>> {
  loading: BooleanState = new BooleanState();
  value?: U = null as any;
  action: T = (() => Promise.resolve()) as T;
  autoAlert: boolean = true;
  context: any = undefined;

  constructor(initialState: Partial<AsyncState<T, U>> = {}) {
    Object.assign(this, initialState);
    makeAutoObservable(this);
  }
  async execute(...args: Parameters<T>): Promise<U | undefined> {
    this.setLoading(true);
    try {
      const response = await this.action.apply(this.context, args);
      this.value = response;
      return response;
    } catch (error) {
      this.handleError(error);
      return undefined;
    } finally {
      this.setLoading(false);
    }
  }
  private setLoading(value: boolean): void {
    this.loading.setValue(value);
  }
  private handleError(error: any): void {
    if (!this.autoAlert) {
      console.error(error);
      throw error;
    }

    if (typeof error?.message !== "string") {
      console.error("Unhandled error structure:", error);
      return;
    }

    const errorMessage = this.extractErrorMessage(error);

    if (this.isUserRejectedError(errorMessage as string)) {
      toast.error("User rejected the transaction.");
    } else if (this.isTransactionNotProcessedError(errorMessage as string)) {
      toast.success("The transaction was successful.");
    } else {
      toast.error(errorMessage || "Transaction failed.");
    }
  }
  private extractErrorMessage(error: any): string | null {
    const viemErrorPrefix = "viem";
    const reasonMatch = /reason="([^"]*)"/.exec(error?.message);
    if (reasonMatch) return reasonMatch[1];

    if (error?.message?.includes(viemErrorPrefix)) {
      const messageLines = error.message.split("\n");
      return messageLines[0] || null;
    }

    return error?.message || null;
  }
  private isUserRejectedError(message: string): boolean {
    const rejectionKeywords = ["user rejected transaction", "user rejected", "user denied"];
    return rejectionKeywords.some((keyword) => message.toLowerCase().includes(keyword));
  }
  private isTransactionNotProcessedError(message: string): boolean {
    const notProcessedKeywords = [
      "The Transaction may not be processed on a block yet",
      "could not be found",
    ];
    return notProcessedKeywords.some((keyword) => message.includes(keyword));
  }
}
