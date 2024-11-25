import { observer } from "mobx-react-lite";
import MModal from "../common/m-modal";
import { Button } from "@nextui-org/button";
import { useStore } from "@/store";
import MInput from "../common/m-input";
import { MButton } from "../common/m-button";

const SlippageModal = observer(() => {
  const { trade } = useStore();
  return (
    <MModal size="md" title={`SET MAX. SLIPPAGE (%)`} subtitle={'THIS IS THE MAXIMUM AMOUNT OF SLIPPAGE YOU ARE WILLING TO ACCEPT WHEN PLACING TRADES'} subtitleClassName="text-xs" isOpen={trade.isShowSlippageModal} onOpenChange={() => trade.setData({ isShowSlippageModal: !trade.isShowSlippageModal })}>
      <div className="pt-4 pb-6">
        <div className="flex items-center gap-2">
          {trade.slippageConfig.map((v, i) => (
            <MButton
              color="tab"
              className={
                `${trade.defaultSlippage === v && "border-primary text-primary"} h-12 px-2 min-w-16`
              }
              key={i}
              onClick={() => {
                trade.setData({ defaultSlippage: v });
              }}>
              {v}%
            </MButton>
          ))}
          <MInput
            variant="bordered"
            type="number"
            placeholder="CUSTOM"
            classNames={{
              inputWrapper: [
                'bg-focusBg',
                'hover:border-[#9333ea]',
                'focus:border-[#9333ea]',
              ],
            }}
            endContent={<div className="flex items-center">%</div>}
            onFocus={() => {
              trade.setData({ defaultSlippage: 0 });
            }}
          />
        </div>
        <Button
          color="primary"
          size="lg"
          className="w-full mt-6 font-semibold"
          onClick={() => {
            trade.setData({ isShowSlippageModal: false });
          }}>
          SAVE SETTINGS
        </Button>
      </div>
    </MModal>
  );
});

export default SlippageModal;
