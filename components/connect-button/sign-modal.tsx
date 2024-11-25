import { Button } from "@nextui-org/button";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import MModal from "../common/m-modal";

const SignModal = observer(() => {
  const { wallet } = useStore();

  return (
    <MModal hideCloseButton={true} isOpen={wallet.isOpenSignModal}>
      <div className="flex flex-col items-center gap-6 pb-6">
        <div>SIGN IT TI MEME</div>
        <Button color="primary" className="w-1/2" isLoading={wallet.signLoading} isDisabled={wallet.signLoading} onClick={() => {
          wallet.sign();
        }}>
            SIGN MESSAGE 
        </Button>
      </div>
    </MModal>
  );
});

export default SignModal;
