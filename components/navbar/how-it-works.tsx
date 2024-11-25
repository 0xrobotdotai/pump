"use client";
import React, { useEffect } from "react";
import clsx from "clsx";
import MModal from "@/components/common/m-modal";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { Button } from "@nextui-org/button";
import Link from "next/link";

const HowItWorks: React.FC = observer(() => {
  const { global } = useStore();
  const { isReady, isHowItWorksModalOpen, closeHowItWorksModal, openHowItWorksModal } = global;

  useEffect(() => {
    if (!isReady) {
      // openHowItWorksModal();
    }
  }, []);

  return (
    <>
      <span className={clsx("text-primary underline hover:text-primary cursor-pointer")} key="how-it-works" onClick={() => openHowItWorksModal()}>
        {" How it works? "}
      </span>
      <MModal size="xl" title="HOW IT WORKS" isOpen={isHowItWorksModalOpen} isDismissable={false} onOpenChange={() => closeHowItWorksModal()}>
        <div className="py-6 w-full flex flex-col gap-6 text-white/80">
          <div>
            <div className="font-semibold text-md mb-2 text-md text-primary">How to Launch Your Token with RobotPump</div>
            <div className="mb-3">Step 1: Launch your token with 10 $ROBA and $IOTX for gas fees.</div>
            <div className="mb-3">Step 2: When 80% of tokens are sold out, and market cap reach 385,714.28 IOTX, the token creator will receive a reward of 200 $IOTX.</div>
            <div className="mb-3">Step 3: At the 100,000 $IOTX milestone, 100,000 $IOTX and 19% of the token’s liquidity are deposited into Mimo and burned, with 1% allocated to start PoW mining.</div>
          </div>
          <div>
            <div className="font-semibold text-md mb-2 text-primary">How to Participate in RobotPump</div>
            <div className="mb-3">Step 1: Select a token that interests you.</div>
            <div className="mb-3">Step 2: Purchase the token on the bonding curve.</div>
            <div className="mb-3">Step 3: Sell whenever you like to lock in profits or manage losses.</div>
            <div className="mb-3">Step 4: When 80% of tokens are sold out, and market cap reach 385,714.28 IOTX, the token’s liquidity is moved to Mimo for burn, and PoW mining begins—keeping the momentum alive!</div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <Button color="primary" size="sm" className="w-1/2 lg:w-1/4" as={Link} href="https://mimo.exchange/buy-iotx/crypto" target="_blank">
              Buy $IOTX
            </Button>
            <Button color="primary" size="sm" className="w-1/2 lg:w-1/4" as={Link} href="https://mimo.exchange/swap?inputCurrency=IOTX&outputCurrency=0xe5f8dbf17c9ec8eb327d191dba74e36970877587" target="_blank">
              Buy $ROBA
            </Button>
            <Button color="primary" size="sm" className="w-1/2 lg:w-1/4" as={Link} href="/create">
              Create Token
            </Button>
          </div>
        </div>
      </MModal>
    </>
  );
});

export default HowItWorks;
