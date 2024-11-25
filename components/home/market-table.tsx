"use client";
import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { helper } from "@/lib/helper";
import Link from "next/link";
import SearchInput from "../search";
import { TOKEN } from "@/store/types/token";
import { Skeleton } from "@nextui-org/skeleton";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Icon } from "@iconify/react";
import { Select, SelectItem } from "@nextui-org/select";
import EmptyResult from "../common/empty-result";
import ImageFall from "../image-fallback";
import { Checkbox } from "@nextui-org/checkbox";

const MarketTable: React.FC<{
  tokens: TOKEN[];
  sortOrder: string;
  sortBy: string;
  keyword?: string;
  setSortOrder: (selected: any) => void;
  setSortBy: (selected: any) => void;
}> = observer(({ tokens }) => {
  const { market } = useStore();
  const { clearSearch } = market;

  const handlePrevious = () => {
    if (market.currentPage > 1) {
      market.setData({
        currentPage: market.currentPage - 1,
      });
    }
    market.getTokens.execute();
  };

  const handleNext = () => {
    market.setData({
      currentPage: market.currentPage + 1,
    });
    market.getTokens.execute();
  };

  return (
    <div className="flex flex-col w-full mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <SearchInput />
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 items-center">
          <section className="w-full md:w-auto flex gap-4 items-center">
            <Select size="md" variant="bordered" className="w-2/3 md:w-[160px] text-white" disallowEmptySelection defaultSelectedKeys={[market.sortBy]} value={market.sortBy} onChange={(e) => market.setSortBy(e.target.value)}>
              {market.sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            <Select size="md" variant="bordered" className="w-1/3 md:w-[100px] text-white" disallowEmptySelection defaultSelectedKeys={[market.sortOrder]} value={market.sortOrder} onChange={(e) => market.setSortOrder(e.target.value)}>
              {market.sortOrderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </section>
          <div className="flex gap-4 items-center">
            <Checkbox
              size="sm"
              checked={market.listed}
              onValueChange={(v) => market.changeList(v)}
              classNames={{
                base: "flex-none border-2 border-default rounded-xl mx-0",
                label: market.listed ? "text-primary" : "text-foreground-500",
              }}>
              Listed on MimoSwap
            </Checkbox>
            <Button
              isIconOnly
              variant="bordered"
              className="text-foreground-500 hover:text-primary"
              onClick={() => {
                if (market.getTokens.loading.value) return;
                market.getTokens.execute();
              }}>
              <Icon icon="ic:sharp-refresh" width="1.2rem" height="1.2rem" />
            </Button>
          </div>
        </div>
      </div>

      {market.getTokens.loading.value || market.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-10 gap-6 md:gap-6">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((item) => {
            return (
              <Card radius="lg" className="h-[382px]" key={item}>
                <Skeleton className="rounded-sm h-[240px]">
                  <div className="h-24 rounded-sm bg-default-300"></div>
                </Skeleton>
                <div className="space-y-2 p-4 w-full">
                  <Skeleton className="rounded-sm w-1/2">
                    <div className="h-3 w-1/2 rounded-sm bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="rounded-sm w-2/3">
                    <div className="h-3 w-2/3 rounded-sm bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="rounded-sm h-[40px]">
                    <div className="h-3 rounded-sm bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="rounded-sm">
                    <div className="h-3 rounded-sm bg-default-300"></div>
                  </Skeleton>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <>
          {tokens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-10 gap-6 md:gap-6">
              {tokens.map((token: TOKEN) => {
                return (
                  <Link href={`/token/${token?.id}`} className="flex justify-start items-start flex-col cursor-pointer overflow-hidden rounded-xl border-1 border-primary/50 bg-[#151527] hover:border-primary" key={token.id} onClick={clearSearch}>
                    <div className="flex-none w-full h-[280px] md:h-[240px] bg-[#151527]/30">
                      <ImageFall src={token.image || ""} alt={token?.symbol} className="w-full h-full object-cover" />
                    </div>
                    <div className="h-full flex-col justify-start gap-3 items-start flex p-4 bg-[#151527] text-white/50">
                      <div className="text-center text-xs leading-none">
                        Created by:{" "}
                        <Link href={`/profile/${token?.creator}`} className="underline pointer-events-auto">
                          {helper.shortaddress(token.creator)}
                        </Link>
                      </div>
                      <div className="flex flex-col gap-1 text-sm font-semibold line-clamp-1">
                        <div className="text-xs">{token?.name}</div>
                        <span className="text-white">${token?.symbol}</span> 
                      </div>
                      <div className="text-xs line-clamp-2 flex-1">{token.description}</div>
                      {
                        token.launchedAt ? <div className="flex items-center gap-2 text-white text-sm">
                          <img src="/imgs/hj.svg" className="w-4 h-4" alt="" /> Listed on MimoSwap
                        </div> : <div className="justify-start items-start inline-flex text-sm leading-none">
                        Market Cap: <span className="text-white mx-1">{Number(helper.number.formatNumber(token?.marketCap || "0", "0.00")).toLocaleString()}</span> IOTX
                      </div>
                      }
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyResult />
          )}
        </>
      )}

      <div className="flex items-center justify-between my-6">
        <Button onClick={handlePrevious} size="sm" color="primary" isDisabled={market.currentPage === 1 || market.getTokens.loading.value}>
          Prev
        </Button>
        <div className="flex-1 text-center text-sm font-semibold">Page: {market.currentPage}</div>
        <Button onClick={handleNext} size="sm" color="primary" isDisabled={market.currentPage * market.itemsPerPage >= Number(market.getRobotPads.value?.totalToken) || market.getTokens.loading.value}>
          Next
        </Button>
      </div>
    </div>
  );
});

export default MarketTable;
