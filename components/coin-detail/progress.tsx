import { observer } from "mobx-react-lite";
import { Progress } from "@nextui-org/progress";
import { Icon } from "@iconify/react";
import { Tooltip } from "@nextui-org/tooltip";
import { useStore } from "@/store";

const ProgressContent = observer(() => {
  const {token} = useStore()

  return (
    <div className="w-full py-6 flex flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-lg font-semibold text-white/60 lg:text-white/80">
        <div>Bonding Curve Progress</div>
      </div>
      <Progress
        size="md"
        aria-label="Loading..."
        classNames={{
          base: "w-full",
          track: "drop-shadow-md border border-default",
          indicator: "bg-primary",
          label: "tracking-wider font-medium text-default-600",
          value: "text-foreground/60",
        }}
        label="Market Cap"
        showValueLabel={true}
        value={token?.fetchTokenDetail.value?.progress}
      />
      <div className="text-sm text-white/90 whitespace-pre-line">
        {`When the market cap reach 385,714.28 IOTX, all liquidity from the bonding curve will be deposited into Mimo and permanently burned.`}
      </div>
    </div>
  );
});

export default ProgressContent;
