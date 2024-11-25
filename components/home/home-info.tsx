"use client";
import React, { useEffect } from "react";
import MarketTable from "@/components/home/market-table";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import clsx from "clsx";
import HowItWorks from "../navbar/how-it-works";
import MemeCard from "../meme-card";
import Link from "next/link";


const HomeInfo: React.FC = observer(() => {
  const { market } = useStore();

  useEffect(() => {
    market.getTokens.execute();
  }, [market.sortBy, market.sortOrder]);

  useEffect(() => {
    market.getRobotPads.execute()
    market.getRandomToken.execute()
  }, [])

  return (
    <>
      <div className={clsx("flex flex-col relative w-full", "transition-all duration-300")}>
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 my-8">
          <div className="flex flex-col items-center lg:items-start">
            <img src="/imgs/logo-text-line.svg" className="h-[50px] lg:h-[80px]" alt="" />
            <div className="mt-4 text-sm md:text-xl font-medium text-center">
              The First Meme Fair Launch Platform on IoTeX. <br />
              <span className="flex items-center gap-1.5 mt-2 justify-center lg:justify-start">
                PUMP TO THE DEEP TECH <HowItWorks />
              </span>
            </div>
            <Link href={'/mining'} className="hidden lg:block">
              <button className="border border-solid border-[#564C86] bg-gradient-to-r to-[#92E7FF]/10 from-[#FED25B]/10 via-[#F3AEF5]/10 font-semibold mt-4 text-sm px-4 py-1.5 rounded-lg text-white">
                Pump To The Moon With RobotPump 
              </button>
            </Link>
            <Link href={'/create'} className="w-1/2 block lg:hidden">
              <button className="w-full border border-solid border-[#564C86] bg-gradient-to-r to-[#92E7FF]/10 from-[#FED25B]/10 via-[#F3AEF5]/10 font-semibold mt-4 text-sm px-4 py-1.5 rounded-lg text-white">
                Create
              </button>
            </Link>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="text-xl font-semibold mb-4 text-center w-max mx-auto py-1 px-4 rounded-lg text-white/90">Sovereign of the Peaks</div>
            <MemeCard />
          </div>
        </div>
        <div className="text-white/70">Disclaimer: Tokens listed on this platform are independent and not affiliated with RobotPump. Please <span className="text-primary font-semibold">DYOR</span>.</div>
        <MarketTable
          tokens={market.tokens}
          sortOrder={market.sortOrder}
          sortBy={market.sortBy}
          setSortOrder={market.setSortOrder}
          setSortBy={market.setSortBy}
        />
      </div>
    </>
  );
});

export default HomeInfo;
