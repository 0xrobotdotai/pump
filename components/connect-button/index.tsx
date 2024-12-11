"use client";

import { Button, ButtonGroup } from "@nextui-org/button";
import { Icon } from "@iconify/react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { helper } from "@/lib/helper";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import Link from "next/link";
import toast from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { Avatar } from "@nextui-org/avatar";
import { User } from "@nextui-org/user";
import { MButton } from "../common/m-button";

type SelectWalletProps = {
  type?: "normal" | "BuySell";
};

const SelectWallet = observer(({ type = "normal" }: SelectWalletProps) => {
  const { disconnect } = useDisconnect();
  const { wallet } = useStore();
  const handleDisconnect = () => {
    disconnect();
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(<span className="text-white/80 text-xs font-semibold">COPIED TO CLIPBOARD</span>, {
      icon: <Icon className="text-success" icon="pixelarticons:check-double" />,
    });
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 1,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}>
            {(() => {
              if (!connected) {
                return type === "BuySell" ? (
                  <MButton size="md" color="action" className="bg-background text-base font-semibold leading-relaxed uppercase" onClick={openConnectModal}>
                    Connect Wallet
                  </MButton>
                ) : (
                  <Button size="sm" className="text-black/90 font-semibold text-sm" color="primary" onClick={openConnectModal}>
                    Connect <span className="hidden lg:inline-block">Wallet</span>
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} size="sm" color="danger">
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex items-center gap-4">
                  <Dropdown
                    size="sm"
                    classNames={{
                      content: "min-w-[150px]",
                    }}>
                    <DropdownTrigger>
                      <div>
                        <div className="items-center gap-2 hidden md:flex">
                          <User
                            as="button"
                            avatarProps={{
                              isBordered: false,
                              size: "sm",
                              className: "w-6 h-6 flex-none",
                              src: "/imgs/default-avatar.png",
                            }}
                            className="transition-transform"
                            description={helper.shortaddress(account.address)}
                            name={`${Number(wallet.robaBalance.format).toFixed(0)} $ROBA`}
                          />
                          <Icon icon="pixelarticons:chevron-down" className="" />
                        </div>
                        <div className="flex md:hidden gap-2 items-center">
                          <Avatar src={"/imgs/default-avatar.png"} className="w-6 h-6" />
                          <div className="text-xs">{helper.shortaddress(account.address, 0, 4)}</div>
                          <Icon icon="pixelarticons:chevron-down" />
                        </div>
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="roba">
                        <Link target="_blank" href={`https://mimo.exchange/swap?inputCurrency=IOTX&outputCurrency=0xe5f8dbf17c9ec8eb327d191dba74e36970877587`}>
                          Get $ROBA
                        </Link>
                      </DropdownItem>
                      <DropdownItem key="create">
                        <Link href={`/create`}>Create</Link>
                      </DropdownItem>
                      <DropdownItem key="mining">
                        <Link href={`/mining`}>Mining</Link>
                      </DropdownItem>
                      <DropdownItem key="ai-agent">
                        <Link href={`https://link.medium.com/0uZWZPhKePb`} target="_blank">Ai Agent</Link>
                      </DropdownItem>
                      <DropdownItem onClick={() => handleCopy(account.address)} key="copy">
                        Copy Address
                      </DropdownItem>
                      <DropdownItem key="view" textValue="View Profile">
                        <Link href={`/profile/${account.address}`}>View Profile</Link>
                      </DropdownItem>
                      <DropdownItem key="disconnect" onClick={handleDisconnect} textValue="Disconnect">
                        Disconnect
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
});

export default SelectWallet;
