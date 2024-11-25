"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Avatar } from "@nextui-org/avatar";
import Link from "next/link";
import { helper } from "@/lib/helper";
import { useStore } from "@/store";
import { User } from "@nextui-org/user";
import { Button } from "@nextui-org/button";
import {Spinner} from "@nextui-org/spinner";

const Profile: React.FC<{ params: { id: string } }> = observer(({ params }: { params: { id: string } }) => {
  const { market } = useStore();

  useEffect(() => {
    market.getMyToken.execute(params.id);
  }, [params.id]);

  return (
    <main className="w-full lg:w-[500px] mx-auto flex flex-col justify-center gap-6 items-center rounded-xl bg-white/5 mt-20 p-4">
      <Avatar className="w-[100px] h-[100px]" src="/imgs/avatar.png"></Avatar>
      <Link href={`https://iotexscan.io/address/${params?.id}`} target="_blank">
        {helper.shortaddress(params?.id)}
      </Link>
      {market.getMyToken.loading.value ? (
        <div className="h-[200px] w-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : market.getMyToken.value?.length === 0 ? (
        <div className="text-white/50 h-[300px] flex justify-center items-center"> No tokens found in portfolio </div>
      ) : (
        <div className="w-full flex flex-col gap-4 ">
          {market.getMyToken.value?.map((item) => {
            return (
              <div key={item.id} className="w-full flex items-center justify-between">
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    size: "sm",
                    src: item.image || "/imgs/default-avatar.png",
                    className: "mr-1",
                  }}
                  classNames={{
                    description: "mt-1",
                  }}
                  description={`Market Cap: ${helper.number.formatNumber(item?.marketCap || "0", "0.00")} IOTX`}
                  name={`$${item.symbol} (${item.name})`}
                />
                <Button color="primary" size="sm" as={Link} href={`/token/${item.id}`} target="_blank">
                  View
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
});

export default Profile;
