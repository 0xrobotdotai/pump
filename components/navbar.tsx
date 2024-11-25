"use client";
import { Navbar as NextUINavbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import SelectWallet from "./connect-button";
import SignModal from "./connect-button/sign-modal";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useStore } from "@/store";
import { defaultChain } from "@/config/wagmi";

export const useEnhanceSignMessage = () => {
  const { signMessageAsync } = useSignMessage();
  const { data } = useWalletClient();

  if (data) {
    return { signMessageAsync };
  } else {
    return { signMessageAsync: null };
  }
};

export const Navbar: React.FC = observer(() => {
  const pathname = usePathname();
  const { wallet } = useStore();


  const menus = [
    { name: "Home", href: "/" },
    { name: "Create", href: "/create" },
    { name: "Mining", href: "/mining" },
    { name: "Get $ROBA", href: "https://mimo.exchange/swap?inputCurrency=IOTX&outputCurrency=0xe5f8dbf17c9ec8eb327d191dba74e36970877587" },
    { name: "Get $IOTX", href: "https://mimo.exchange/buy-iotx/crypto" },
  ];

  const { address, isConnected } = useAccount();
  wallet.chain = defaultChain;
  wallet.coin = { ...wallet.coin, ...defaultChain.nativeCurrency };

  useEffect(() => {
    if (address) {
      wallet.address = address as `0x${string}`;
      wallet.isConnect = isConnected;
      Promise.all([wallet.getBalance.execute(), wallet.getRobaBalance.execute()]);
    }
  }, [address]);

  const MediaLinks = () => (
    <>
      <NextLink href={"https://t.me/robot_ai_iotex"} target="_blank">
        <Icon icon="la:telegram-plane" width="1.5rem" height="1.5rem" className="w-4 h-4 md:w-6 md:h-6 text-white/60 hover:text-primary" />
      </NextLink>
      <NextLink href={"https://x.com/0xrobot_ai"} target="_blank">
        <Icon icon="prime:twitter" width="1.2rem" height="1.2rem" className="w-3 h-3 md:w-5 md:h-5 text-white/60 hover:text-primary" />
      </NextLink>
    </>
  );

  return (
    <>
      <NextUINavbar
        maxWidth="full"
        position="sticky"
        classNames={{
          base: "px-4 lg:px-8 xl:px-[5%] pt-0 md:pt-3",
          wrapper: "px-0"
        }}>
        <NavbarContent justify="start">
          <NextLink href={"/"} className="flex items-center gap-3 w-max md:mr-4">
            <img src="/imgs/logo.svg" alt="" className="w-8 h-8 md:w-12 md:h-12"></img>
            <img src="/imgs/beta.svg" className="h-5 md:h-6" alt="" />
          </NextLink>
          <div className="hidden lg:flex items-center gap-6">
            {menus.map((item, index) => (
              <NavbarItem className={clsx("leading-6 font-semibold text-lg xl:text-xl text-white/60 cursor-pointer hover:text-primary data-[active=true]:text-white border-b-2 border-b-transparent data-[active=true]:border-b-primary")} key={item.href} isActive={pathname === item.href}>
                <NextLink color="foreground" href={item.href} target={item.href.includes('https') ? '_blank' : '_self'}>
                  {item.name}
                </NextLink>
              </NavbarItem>
            ))}
            <MediaLinks />
          </div>
        </NavbarContent>

        <NavbarContent justify="end">
          <NextLink className="text-sm font-semibold flex-none" target="_blank" href={'https://mimo.exchange/buy-iotx/crypto'}>Get $IOTX</NextLink>
          <SelectWallet />
        </NavbarContent>
      </NextUINavbar>

      <SignModal />

    </>
  );
});
