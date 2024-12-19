import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import Link from "next/link";
import { helper } from "@/lib/helper";
import { TOKEN } from "@/store/types/token";
import { Skeleton } from "@nextui-org/skeleton";
import ImageFall from "./image-fallback";

const MemeCard = observer(() => {
  const { wallet, market } = useStore();

  const token = market.getRandomToken.value as TOKEN;

  if (!token)
    return (
      <div className="h-[120px] lg:h-[160px] flex items-center bg-[#151527] rounded-xl overflow-hidden">
        <Skeleton className="rounded-sm flex-none h-[120px] lg:h-[160px] w-[120px] lg:w-[160px]">
          <div className="h-24 rounded-sm bg-default-300"></div>
        </Skeleton>
        <div className="w-full p-4 flex flex-col gap-3">
          <Skeleton className="rounded-sm w-1/2">
            <div className="h-3 w-1/2 rounded-sm bg-default-200"></div>
          </Skeleton>
          <Skeleton className="rounded-sm w-2/3">
            <div className="h-3 w-2/3 rounded-sm bg-default-200"></div>
          </Skeleton>
          <Skeleton className="rounded-sm h-[20px] lg:h-[50px]">
            <div className="h-3 rounded-sm bg-default-200"></div>
          </Skeleton>
          <Skeleton className="rounded-sm">
            <div className="h-3 rounded-sm bg-default-300"></div>
          </Skeleton>
        </div>
      </div>
    );

  return (
    <>
      {market.getRandomToken.loading.value || !market.getRandomToken.value?.name ? (
        <div className="h-[120px] lg:h-[160px] flex items-center bg-[#151527] rounded-xl overflow-hidden">
          <Skeleton className="rounded-sm flex-none h-[120px] lg:h-[160px] w-[120px] lg:w-[160px]">
            <div className="h-24 rounded-sm bg-default-300"></div>
          </Skeleton>
          <div className="w-full p-4 flex flex-col gap-3">
            <Skeleton className="rounded-sm w-1/2">
              <div className="h-3 w-1/2 rounded-sm bg-default-200"></div>
            </Skeleton>
            <Skeleton className="rounded-sm w-2/3">
              <div className="h-3 w-2/3 rounded-sm bg-default-200"></div>
            </Skeleton>
            <Skeleton className="rounded-sm h-[20px] lg:h-[50px]">
              <div className="h-3 rounded-sm bg-default-200"></div>
            </Skeleton>
            <Skeleton className="rounded-sm">
              <div className="h-3 rounded-sm bg-default-300"></div>
            </Skeleton>
          </div>
        </div>
      ) : (
        <Link href={`/token/${token?.id}`} className="flex h-[120px] lg:h-[160px] justify-start items-start cursor-pointer overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-r  to-[#92E7FF] from-[#FED25B] via-[#F3AEF5] hover:border-primary" key={token?.id}>
          <div className="flex-none h-[120px] lg:h-[160px] w-[120px] lg:w-[160px] bg-[#151527]/30">
            <ImageFall src={token?.image || ''} alt={token?.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 h-full flex-col gap-1 lg:gap-3 justify-start items-start flex p-2 lg:p-4 bg-[#151527] text-white/50">
            <div className="text-center text-xs leading-none opacity ">
              Created by: <Link href={`/profile/${token?.creator}`} className="pointer-events-auto"><span className="underline">{helper.shortaddress(token?.creator || "")}</span></Link>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold line-clamp-1">
              <span className="text-white">${token?.symbol}</span> ({token?.name})
            </div>
            <div className="text-xs line-clamp-2">{token?.description}</div>
            <div className="flex-1 justify-start items-end inline-flex text-sm leading-none">
              Market Cap: <span className="text-white mx-1"> {helper.number.formatNumber(token?.marketCap || "0", "0.00")} </span> IOTX
            </div>
          </div>
        </Link>
      )}
    </>
  );
});

export default MemeCard;
