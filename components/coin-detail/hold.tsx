import { helper } from "@/lib/helper";
import { useStore } from "@/store";
import { COINITEM } from "@/store/token";
import { Icon } from "@iconify/react";
import { Spinner } from "@nextui-org/spinner";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HolderDistribution = observer(() => {
  const option = {
    user: "Ceiahvw5iFMLddc2wySN4NyMuA2uKimh2shFRMDKz9hS",
    name: "KINGPEPE",
    percent: "10%",
  };

  const {token} = useStore()


  // useEffect(() => {
  //   console.log('mint', token.detail?.token?.mint)
  //   if(token.detail?.token?.mint) {
  //     token.getHolderDistribution.execute(token.detail?.token?.mint);
  //   }
  // }, [token.detail?.token?.mint])

  return (
    <div className="w-full md:w-[400px] flex flex-col gap-4">
      <div className="pb-4 text-white/60">
        Holder distribution
      </div>
      {
        token.getHolderDistribution.loading.value ? <div className="flex items-center justify-center h-48">
          <Spinner />
        </div> : <>
          {
            token.getHolderDistribution.value?.length === 0 ? <div className="text-white/50 flex items-center justify-center h-48">
              No Holder
            </div> : [option, option, option, option, option].map((item, index) => (
        <div className="flex items-center justify-between" key={index}>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <span>{index + 1}.</span>
            <Icon icon="pixelarticons:wallet" color="text-white/60" />
            <span>{helper.shortaddress(item.user)}</span>
            {index === 0 && (
              <div className="bg-default-200 text-xs text-primary py-0.25 px-1">
                {`bonding curve`.toUpperCase()}
              </div>
            )}
          </div>
          <div>{item.percent}</div>
        </div>
      ))
          }
        </>
      }
    </div>
  );
});

export default HolderDistribution;
