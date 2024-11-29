import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useStore } from "@/store";
import { helper } from "@/lib/helper";
import { Image } from "@nextui-org/image";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { useParams } from "next/navigation";
import ImageNextFall from "../image-fallback/ImageNextFall";

const CoinInfo = observer(() => {
  const { token } = useStore();
  const { detail } = token;
  const parmas = useParams();

  const BaseInfo = () => (
    <div className="flex md:items-center md:justify-between w-full flex-col md:flex-row gap-4">
      <div className="flex md:items-center gap-1 lg:gap-4 text-md lg:text-2xl pt-2 text-white w-full md:w-2/3 line-clamp-2">
        {detail?.name || '...'}
        <span className="text-white/60">${detail?.symbol || '...'}</span>
      </div>
      <div className="flex items-center gap-3 md:gap-5 text-white">
        {detail?.telegram && (
          <Link href={detail?.telegram}>
            <Icon icon="la:telegram-plane" className="w-5 h-5 hover:text-primary" />
          </Link>
        )}
        {detail?.twitter && (
          <Link href={detail?.twitter}>
            <Icon icon="prime:twitter" className="w-4 h-4 hover:text-primary" />
          </Link>
        )}
        {detail?.website && (
          <Link href={detail?.website}>
            <Icon icon="mingcute:earth-line" className="w-5 h-5 hover:text-primary" />
          </Link>
        )}
        <div
          className="cursor-pointer"
          onClick={() => {
            addToMetaMask({
              ethAddress: detail?.id || "",
              symbol: detail?.symbol!,
              decimals: 18,
              logo: detail?.image!,
            });
          }}>
          <Avatar size="sm" className="bg-transparent" src="/imgs/MetaMask.svg"></Avatar>
        </div>
        <Button size="sm" variant="bordered" color="primary" onClick={() => handleCopy(`https://pump.0xrobot.ai/token/${detail?.id}`)} key="copy">
          Share
        </Button>
      </div>
    </div>
  );

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const addToMetaMask = async (token: { ethAddress: string; symbol: string; decimals: number; logo: string }) => {
    try {
      const ethereum = (window as any).ethereum;
      ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: { address: token.ethAddress, symbol: token.symbol, decimals: token.decimals, image: token.logo },
        },
      });
    } catch (e) {
      toast.error('add failed')
    }
  };

  const CardMini = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="flex flex-col items-start gap-1">
      <span className="text-sm">{title}</span>
      {children}
    </div>
  );

  const OtherInfo = () => (
    <>
      <div className="text-sm line-clamp-2">{detail?.description}</div>
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="flex gap-6 items-start">
          <CardMini title="Price">
            <span className="text-white">{helper.number.formatNumber(detail?.price || 0, "0.00000")} IOTX</span>
          </CardMini>
          <CardMini title="Market Cap">
            <span className="text-white"> {Number(helper.number.formatNumber(detail?.marketCap || 0, "0.00")).toLocaleString()} IOTX</span>
          </CardMini>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="text-sm text-white/60 flex gap-2">
            <span>Created by:</span>
            <Link href={`/profile/${detail?.creator}`}>
              <span className="text-primary hover:text-primary underline">{helper.shortaddress(detail?.creator || "...")}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm">
            Contract:{" "}
            <Link className="text-primary underline" target="blank" href={`https://iotexscan.io/token/${detail?.id}`}>
              <span>{helper.shortaddress(detail?.id || "...")}</span>
            </Link>
            <Icon icon="tabler:copy" fontSize={20} className="text-primary cursor-pointer" onClick={() => handleCopy(`${detail?.id}`)} />
          </div>
          <div className="flex items-center gap-2 text-sm">
            Holders:{" "}
            <Link className="text-primary underline" target="blank" href={`https://iotexscan.io/token/${detail?.id}#token_holders`}>
              <Icon icon="eva:external-link-outline" fontSize={20} className="text-primary cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full pb-6 mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <Link className="block cursor-pointer text-white/50 font-semibold" href={"/"}>
          {"< Back"}
        </Link>
        <span className="text-white/60 text-xs">Disclaimer: Tokens listed on this platform are independent and not affiliated with RobotPump. Please DYOR.</span>
      </div>
      <div className="w-full flex flex-col lg:flex-row items-center justify-end gap-4 mb-4">
        <div className="text-white/50 text-sm">{detail?.launchedAt ? `Congratulations, Listed on MimoSwap` : "When 80% of tokens are sold out, and market cap reach 385,714.28 IOTX,  anyone can launch token."}</div>
        {detail?.launchedAt ? (
          <Button size="sm" as={Link} target="_blank" className="bg-[#acfe48] text-black" href={`https://mimo.exchange/swap?inputCurrency=IOTX&outputCurrency=${token?.detail?.id}`}>
            Go MimoSwap
          </Button>
        ) : (
          <Button size="sm" isDisabled={!detail?.completed} color="primary" onClick={() => token.launchToken.execute(parmas.mint as string)}>
            Launch Token
          </Button>
        )}
      </div>
      <section className="w-full bg-white/5 p-4 rounded-lg hidden md:flex flex-row items-start gap-4">
        <ImageNextFall src={detail?.image || ''} className="w-[100px] h-[100px] md:w-[170px] md:h-[170px] flex-none bg-[#151527] object-cover" alt={detail?.symbol} />
        <div className="flex-1 flex flex-col gap-3 text-white/65 text-sm">
          <BaseInfo />
          <OtherInfo />
        </div>
      </section>
      <section className="w-full bg-white/5 p-3 rounded-lg flex md:hidden flex-col items-start gap-4">
        <div className="flex items-cneter gap-4">
          <div className="flex-none">
            <ImageNextFall src={detail?.image || ''} className="block w-[80px] h-[80px] flex-none bg-[#151527]  object-cover" alt={detail?.symbol}></ImageNextFall>
          </div>
          <BaseInfo />
        </div>
        <div className="flex-1 flex flex-col gap-3 text-white/65 text-sm">
          <OtherInfo />
        </div>
      </section>
    </div>
  );
});

export default CoinInfo;
