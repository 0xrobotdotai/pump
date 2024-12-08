import { observer, useLocalObservable } from "mobx-react-lite";
import { MButton } from "../common/m-button";
import MInput from "../common/m-input";
import { useStore } from "@/store";
import SlippageModal from "./slippage-modal";
import { Avatar } from "@nextui-org/avatar";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import BigNumber from "bignumber.js";
import { Spinner } from "@nextui-org/spinner";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { useParams } from "next/navigation";
import Link from "next/link";
import SelectWallet from "../connect-button";

const BuySell = observer(() => {
  const { trade, token, wallet } = useStore();
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const params = useParams();

  const store = useLocalObservable(() => ({
    mainTabs: [0, 100, 1000, 10000],
    tokenTabs: [0, 0.25, 0.5, 0.75, 1],

    get buyBtnName() {
      const IOTXBalance = wallet.balance;
      const notEmpty = token.buyAmount.format !== "";

      if (!notEmpty) {
        return {
          name: "Place Trade",
          isValid: false,
        };
      }

      if (notEmpty && !IOTXBalance.value.isGreaterThan(0)) {
        return {
          name: "Insufficient Balance",
          isValid: false,
        };
      }

      // balance and buyAmount
      if (notEmpty && !IOTXBalance.value.isGreaterThan(token.buyAmount.value)) {
        return {
          name: "Insufficient Balance",
          isValid: false,
        };
      }

      return {
        name: "Place Trade",
        isValid: true,
      };
    },
    get sellBtnName() {
      const tokenBalance = token.balance;
      const notEmpty = token.buyAmount.format !== "";

      if (!notEmpty) {
        return {
          name: "Place Trade",
          isValid: false,
        };
      }

      if (notEmpty && !tokenBalance.value.isGreaterThan(0)) {
        return {
          name: "Insufficient Balance",
          isValid: false,
        };
      }

      // balance and buyAmount
      if (notEmpty && !tokenBalance.value.isGreaterThanOrEqualTo(token.buyAmount.value)) {
        return {
          name: "Insufficient Balance",
          isValid: false,
        };
      }

      return {
        name: "Place Trade",
        isValid: true,
      };
    },
  }));

  const debouncedChangeHandler = useCallback(
    debounce(() => {
      token.amountChange(params.mint as string);
    }, 500),
    []
  );

  const handleChange = (val: any) => {
    if (Number(val) < 0 || val === "") {
      token.buyAmount.setValue(new BigNumber(""));
      return;
    }
    token.buyAmount.setFormat(val);
    debouncedChangeHandler();
  };

  return (
    <div className="relative">
      {!isConnected && (
        <div className="absolute w-full h-full top-0 z-10 flex items-center justify-center">
          <MButton size="md" color="action" className="bg-background text-base font-semibold leading-relaxed uppercase" onClick={() => openConnectModal && openConnectModal()}>
            Connect Wallet
          </MButton>
        </div>
      )}
      <div className={`w-full flex flex-col gap-6 relative ${isConnected ? "blur-none" : "blur-sm"}`}>
        <div className="w-full rounded-s overflow-hidden">
          <MButton
            color={token.tabKey === "buy" ? "tabActive" : "tab"}
            className="rounded-none w-1/2"
            onClick={() => {
              token.setData({ tabKey: "buy" });
              token.resetEthAndTokenInput();
            }}>
            BUY
          </MButton>
          <MButton
            color={token.tabKey === "sell" ? "sell" : "tab"}
            className="rounded-none w-1/2"
            onClick={() => {
              token.setData({ tabKey: "sell" });
              token.resetEthAndTokenInput();
            }}>
            SELL
          </MButton>
        </div>
        <div className="flex-col flex gap-3">
          <div className={`flex items-center justify-between`}>
            <div className="text-xs font-semibold">Balance: {token.tabKey === "buy" ? wallet.balance.format || 0 : token.balance.format || 0}</div>
            <div
              className="flex items-center text-blue text-xs font-semibold cursor-pointer"
              onClick={() => {
                trade.setData({ isShowSlippageModal: true });
              }}>
              Set Max Slippage
            </div>
          </div>
          {token.tabKey === "buy" ? (
            <MInput
              variant="bordered"
              placeholder="0.0"
              type="number"
              disabled={token.calcPrice.loading.value || token.confirmClick.loading.value}
              endContent={
                <div className="flex items-center gap-1">
                  <Avatar className="w-5 h-5" src="/imgs/IOTX.png" /> IOTX
                </div>
              }
              value={token.buyAmount.format}
              onValueChange={handleChange}
            />
          ) : (
            <MInput
              variant="bordered"
              placeholder="0.0"
              type="number"
              disabled={token.calcPrice.loading.value || token.confirmClick.loading.value}
              endContent={
                <div className="flex items-center gap-1">
                  <Avatar className="w-5 h-5 flex-none" src={token.detail?.image} alt=""></Avatar> {token.detail?.symbol}
                </div>
              }
              value={token.buyAmount.format}
              onValueChange={handleChange}
            />
          )}
          {token.buyAmount.format && (
            <div className="flex items-center gap-1 text-sm text-white/90">
              {token.calcPrice.loading.value ? <Spinner size="sm" /> : <div>{token.quantityToken}</div>}
              <div>{token.tabKey === "buy" ? token.detail?.symbol : "IOTX"}</div>
            </div>
          )}
          <div className={clsx("grid gap-4", token.tabKey === "buy" ? "grid-cols-4" : "grid-cols-5")}>
            {token.tabKey === "buy" ? (
              <>
                {store.mainTabs.map((item) => {
                  return (
                    <MButton color="tab" size="xs" key={item} disabled={token.calcPrice.loading.value} onClick={() => !token.calcPrice.loading.value && token.mainTabChange(item)}>
                      {item === 0 ? "Reset" : `${item} IOTX`}
                    </MButton>
                  );
                })}
              </>
            ) : (
              <>
                {store.tokenTabs.map((item) => {
                  return (
                    <MButton color="tab" size="xs" key={item} disabled={token.calcPrice.loading.value} onClick={() => !token.calcPrice.loading.value && token.tokenSellTabs(item)}>
                      {item === 0 ? "Reset" : `${item * 100}%`}
                    </MButton>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div>
          {isConnected ? (
            <>
              {token.detail?.completed ? (
                <>
                  {token.detail?.completed ? (
                    <MButton target="_blank" color={"primary"} size="lg" className="w-full " as={Link} href={`https://mimo.exchange/swap?inputCurrency=IOTX&outputCurrency=${token?.detail?.id}`}>
                      Go MimoSwap
                    </MButton>
                  ) : (
                    <MButton color={"primary"} size="lg" className="w-full">
                      Please Launch Token
                    </MButton>
                  )}
                </>
              ) : (
                <>
                  {token.tabKey === "buy" ? (
                    <MButton
                      color={"primary"}
                      isLoading={token.confirmClick.loading.value}
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (!store.buyBtnName.isValid) return false;
                        token.confirmClick.execute();
                      }}>
                      {store.buyBtnName.name}
                    </MButton>
                  ) : (
                    <MButton
                      color={"sell"}
                      isLoading={token.confirmClick.loading.value}
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (!store.sellBtnName.isValid) return false;
                        token.confirmClick.execute();
                      }}>
                      {store.sellBtnName.name}
                    </MButton>
                  )}
                </>
              )}
            </>
          ) : (
            <MButton size="lg" color="action" className="w-full bg-background text-base font-semibold leading-relaxed uppercase" onClick={() => openConnectModal && openConnectModal()} startContent={<Icon icon="pixelarticons:wallet" className="w-6 h-6" />}>
              Connect Wallet
            </MButton>
          )}
          <div className="mt-2 text-sm text-white/60">Disclaimer: Tokens listed are not affiliated with the platform. Proceed at your own risk.</div>
        </div>
        <SlippageModal />
      </div>
    </div>
  );
});

export default BuySell;
