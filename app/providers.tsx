"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider as NextRainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { useRouter } from "next/navigation";
import { memeTheme } from "@/config/theme";
import config from "@/config/wagmi";
import dayjs from "dayjs";
import "dayjs/plugin/utc";
import "dayjs/plugin/duration";
import "dayjs/locale/en";

dayjs.locale("en");
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/duration"));

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}


const queryClient = new QueryClient();

export default function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <NextRainbowKitProvider locale="en" theme={memeTheme}>
              {children}
            </NextRainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
