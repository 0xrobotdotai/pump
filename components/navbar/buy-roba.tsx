"use client";
import React from "react";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import MModal from "@/components/common/m-modal";
import { observer } from "mobx-react-lite";

const BuyRoba: React.FC = observer(() => {
  return (
    <>
      <div className={clsx(linkStyles({ color: "foreground" }), "text-xs text-primary font-bold hover:text-primary cursor-pointer")} key="how-it-works">
        {"[ Buy $ROBA ]"}
      </div>
      <MModal size="xl" title="Buy $ROBA" isOpen={true} isDismissable={false}>
        <div>
          <iframe height="100%" width="100%" id="geckoterminal-embed" title="GeckoTerminal Embed" src="https://www.geckoterminal.com/zh/iotx/pools/0x11dc33d4df35055cc3b8b11b6702db62ac28f666?embed=1&info=0&swaps=0" allow="clipboard-write"></iframe>
        </div>
      </MModal>
    </>
  );
});

export default BuyRoba;
