"use client";

import { observer } from "mobx-react-lite";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import MInput from "../common/m-input";
import MUpload from "../common/m-upload";
import { DownArrowIcon } from "../icons";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store";
import MModal from "../common/m-modal";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import BigNumber from "bignumber.js";
import { Icon } from "@iconify/react";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { Tab, Tabs } from "@nextui-org/tabs";
import { CardBody } from "@nextui-org/card";
import toast from "react-hot-toast";

const CreateCoinContent = observer(() => {
  const { token, wallet } = useStore();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  const createTokenFun = async () => {
    const res = await token.createTokenAndBuy.execute();
    if (res) {
      router.push(`/token/${token.createTokenAndBuy.value?.toLowerCase()}`);
      token.resetCreateForm();
      token.setData({ isOpenConfirmModal: false, isOpenCreateModal: false });
      token.buyAmount.setValue(new BigNumber(0));
    }
  };

  const handleClose = () => {
    token.resetCreateForm();
    token.setData({ isOpenCreateModal: false, isShowMore: false });
    token.buyAmount.setValue(new BigNumber(0));
    router.push("/");
  };

  const debouncedChangeHandler = useCallback(
    debounce(() => {
      token.amountChange(token.createForm.address as string);
    }, 500),
    []
  );

  const handleChange = (val: any) => {
    if (Number(val) < 0 || val === "") {
      token.buyAmount.setValue(new BigNumber(0));
      return;
    }
    token.buyAmount.setFormat(val);
  };

  useEffect(() => {
    token.resetCreateForm();
  }, []);

  const isValidUrl = (url: string) => {
    if (url.includes("https") || url.includes("http")) {
      return true;
    }

    return false;
  };

  return (
    <div className="w-screen h-full bg-background">
      <div className="max-w-[40rem] mx-auto px-4 md:px-0 pt-[5vh]">
        <div className="block cursor-pointer font-bold mb-6 text-white/50" onClick={handleClose}>
          {"< Back"}
        </div>
        <div className="text-white/80 text-sm mb-6"></div>
        <section className="flex flex-col gap-6">
          <div>
            <section className="flex items-center gap-4">
              <MInput
                isReadOnly
                label={"$ROBA Balance"}
                labelPlacement="outside"
                variant="bordered"
                placeholder="Please Connect Wallet"
                value={wallet.getRobaBalance.loading.value ? "..." : Number(wallet.robaBalance.format).toFixed()}
                endContent={
                  <div className="flex items-center gap-2">
                    {isConnected && (
                      <span className="text-primary cursor-pointer" onClick={() => wallet.getRobaBalance.execute()}>
                        <Icon icon="ic:sharp-refresh" width="1.2rem" height="1.2rem" />
                      </span>
                    )}
                    <Button size="sm" as={Link} target="_blank" color="primary" className="px-2 h-[20px] rounded-sm text-xs font-semibold text-black" href={`https://mimo.exchange/swap?inputCurrency=IOTX&outputCurrency=0xe5f8dbf17c9ec8eb327d191dba74e36970877587`}>
                      Get $ROBA
                    </Button>
                  </div>
                }
              />
              <MInput
                isReadOnly
                label={"$IOTX Balance"}
                labelPlacement="outside"
                variant="bordered"
                placeholder="Please Connect Wallet"
                value={wallet.getBalance.loading.value ? "..." : wallet.balance.format}
                endContent={
                  <div className="flex items-center gap-2">
                    {isConnected && (
                      <span className="text-primary cursor-pointer" onClick={() => wallet.getBalance.execute()}>
                        <Icon icon="ic:sharp-refresh" width="1.2rem" height="1.2rem" />
                      </span>
                    )}
                    <Button size="sm" as={Link} target="_blank" color="primary" className="px-2 h-[20px] rounded-sm text-xs font-semibold text-black" href={`https://mimo.exchange/buy-iotx/crypto`}>
                      Get $IOTX
                    </Button>
                  </div>
                }
              />
            </section>
            <div className="text-xs text-primary/90 mt-2">Note: To create your token, you will need 10 $ROBA and a small amount $$IOTX as gas fees. Upon successful launch of your token, you will receive a reward of 200 $IOTX.</div>
          </div>
          <MInput maxLength={50} minLength={3} value={token.createForm.name} onValueChange={(v) => token.setData({ createForm: { ...token.createForm, name: v } })} variant="bordered" placeholder="Enter Name" label="Name" labelPlacement="outside" />
          <MInput maxLength={50} value={token.createForm.symbol} onValueChange={(v) => token.setData({ createForm: { ...token.createForm, symbol: v } })} placeholder="Enter Symbol" label="Symbol" labelPlacement="outside" variant="bordered" />
          <Textarea
            label="Description"
            labelPlacement="outside"
            placeholder="Write your description here"
            variant="bordered"
            classNames={{
              inputWrapper: "bg-background",
            }}
            value={token.createForm.description}
            onValueChange={(v) => token.setData({ createForm: { ...token.createForm, description: v } })}
          />
          <section>
            <div className="mb-2">Image</div>
            <MUpload />
          </section>
          <div
            className="flex items-center justify-center gap-1 text-blue text-sm font-semibold cursor-pointer"
            onClick={() => {
              token.setData({ isShowMore: !token.isShowMore });
            }}>
            Show more options <DownArrowIcon className={token.isShowMore ? "rotate-180" : ""} color="#00B2FF" opacity="1" />
          </div>
          <AnimatePresence>
            {token.isShowMore && (
              <motion.div className="flex flex-col gap-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.8 }}>
                <MInput value={token.createForm?.twitter} onValueChange={(v) => (token.createForm.twitter = v)} variant="bordered" placeholder="(Optional)" label="X (Twitter) Link" labelPlacement="outside" />
                <MInput value={token.createForm?.telegram} onValueChange={(v) => (token.createForm.telegram = v)} variant="bordered" placeholder="(Optional)" label="Telegram Link" labelPlacement="outside" />
                <MInput value={token.createForm.website} onValueChange={(v) => (token.createForm.website = v)} variant="bordered" placeholder="(Optional)" label="Website Link" labelPlacement="outside" />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        {isConnected ? (
          <>
            {wallet.robaBalance.value.isGreaterThan(10) && wallet.balance.value.isGreaterThan(0) ? (
              <Button isDisabled={token.createCoinFun.loading.value} isLoading={token.createCoinFun.loading.value} color="primary" size="lg" className="w-full mt-6 font-semibold" onClick={() => token.createCoinFun.execute()}>
                Create
              </Button>
            ) : (
              <Button
                isDisabled={token.createCoinFun.loading.value}
                target="_blank"
                isLoading={token.createCoinFun.loading.value}
                color="primary"
                size="lg"
                className="w-full mt-6 font-semibold"
                as={Link}
                href="https://mimo.exchange/swap?inputCurrency=IOTX&outputCurrency=0xe5f8dbf17c9ec8eb327d191dba74e36970877587">
                Insufficient Balance, Buy {wallet.robaBalance.value.isGreaterThan(0) ? "IOTX" : "ROBA"}
              </Button>
            )}
          </>
        ) : (
          <Button size="lg" color="primary" className="w-full mt-6 font-semibold text-black/80" onClick={() => openConnectModal && openConnectModal()}>
            Connect Wallet
          </Button>
        )}
        <div className="mt-4 text-center text-sm font-semibold">
          COST TO DEPLOY ETS. <span className="text-primary">10 $ROBA</span>
        </div>
      </div>

      <MModal size="lg" hideCloseButton={token.confirmClick.loading.value} isDismissable={false} title={`Create $${token.createForm?.symbol}`} isOpen={token.isOpenConfirmModal} onOpenChange={() => token.setData({ isOpenConfirmModal: !token.isOpenConfirmModal })}>
        <div className="pb-6">
          <div className="text-white/60 text-sm mb-4 text-center">{`Choose how many $${token.createForm?.symbol} you want to buy (OPTIONAL)`}</div>
          <Input
            className="mb-2"
            type="number"
            placeholder="0.00"
            variant="bordered"
            value={token.buyAmount.format}
            isDisabled={token.confirmClick.loading.value}
            onValueChange={handleChange}
            endContent={
              <div className="flex items-center gap-1 pr-3">
                {token.tabKey === "buy" ? (
                  <>
                    <img src="/imgs/IOTX.png" className="w-6 h-6 rounded-full flex-none"></img>
                    <div>IOTX</div>
                  </>
                ) : (
                  <>
                    <img src={token.createForm?.image || ""} className="w-6 h-6 rounded-full flex-none"></img>
                    <div>{token.createForm?.name}</div>
                  </>
                )}
              </div>
            }></Input>

          <Button isDisabled={!(wallet.balance.value.isGreaterThan(0) && wallet.balance.value.isGreaterThan(token.buyAmount.value))  || token.createTokenAndBuy.loading.value} isLoading={token.createTokenAndBuy.loading.value} color="primary" size="lg" className="w-full mt-6 font-semibold" onClick={createTokenFun}>
            {(wallet.balance.value.isGreaterThan(0) && wallet.balance.value.isGreaterThan(token.buyAmount.value)) ? "Confirm" : "Insufficient Balance"}
          </Button>
        </div>
      </MModal>
    </div>
  );
});

export default CreateCoinContent;
