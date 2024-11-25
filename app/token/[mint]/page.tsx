"use client";
import React, { useEffect } from "react";
import BuySell from "@/components/coin-detail/buy-sell";
import CoinInfo from "@/components/coin-detail/coin-info";
import ProgressContent from "@/components/coin-detail/progress";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import MLoading from "@/components/common/m-loading";
import Transactions from "@/components/coin-detail/Transactions";
import { Skeleton } from "@nextui-org/skeleton";
import { useAccount } from "wagmi";
import { useParams } from "next/navigation";

const CoinDetail: React.FC<{ params: { mint: string } }> = observer(({ params }: { params: { mint: string } }) => {
  const { token } = useStore();
  const { detail } = token;
  const { address } = useAccount();

  useEffect(() => {
    if (!params.mint) return;
    token.isLoading = true;
    token.resetEthAndTokenInput();
    token.fetchTokenDetail.execute(params.mint as string);
  }, [params.mint]);

  useEffect(() => {
    if (address && params.mint) {
      token.getTokenBalanceWeb3.execute(params.mint as string);
    }
  }, [address, params.mint]);

  const Chart = () => (
    <>
      {detail?.launchedAt ? (
        <iframe height="1000px" width="100%" id="geckoterminal-embed" title="GeckoTerminal Embed" src={`https://www.geckoterminal.com/zh/iotx/pools/${detail?.id}?embed=1&info=0&swaps=1`} allow="clipboard-write"></iframe>
      ) : (
        <div className="w-full relative h-[500px]">
          <iframe height="500px" width="100%" className="blur-sm" id="geckoterminal-embed" title="GeckoTerminal Embed" src={`https://www.geckoterminal.com/zh/eth/pools/0x868d966d6d3d94b115e8b003c443c7a7b04a3359?embed=1&info=0&swaps=0`} allow="clipboard-write"></iframe>
          <div className="w-full h-full absolute top-0 left-0 z-10 text-white/80 text-base font-bold flex items-center justify-center">
            The price chart will be available for viewing upon successful launch.
          </div>
        </div>
      )}
    </>
  );

  return (
    <main className="w-full">
      {token.isLoading ? (
        <div className="w-full m-auto mt-40">
          <MLoading />
        </div>
      ) : (
        <>
          <CoinInfo />

          <div className="hidden lg:block mb-2 text-xs text-white/50">Tips: Due to budget constraints, the RobotPump team is unable to provide a server, so the K-line chart for the token will not be available until it launches on mimo. </div>
          <div className="hidden lg:flex items-stretch w-full gap-6">
            <Chart />
            <div className="w-[400px] flex-none">
              <BuySell />
              <ProgressContent />
            </div>
          </div>
          <div className="flex lg:hidden flex-col w-full gap-6">
            <div className="w-full">
              <BuySell />
              <ProgressContent />
            </div>
            <div className="mb-2 text-xs text-white/50">Tips: Due to budget constraints, the RobotPump team is unable to provide a server, so the K-line chart for the token will not be available until it launches on mimo. </div>
            <Chart />
          </div>
          {!detail?.launchedAt && <Transactions />}
        </>
      )}
    </main>
  );
});

export default CoinDetail;
