import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Image } from "@nextui-org/image";

const Mining: React.FC = () => {
  return (
    <main className="w-full mx-auto flex flex-col lg:flex-row items-center md:items-stretch lg:gap-10 pt-20">
      <div className="flex-none">
        <Image src="/imgs/SSR.jpg" className="w-[300px] h-[300px] lg:w-[500px] md:h-[500px] flex-none" alt=""></Image>
      </div>
      <div className="">
        <div className="text-3xl font-semibold mt-20 text-primary">Robot AI Warrior NFT Mining Rewards</div>
        <div className="my-6 md:text-xl flex-1 mb-10">Holders of the AI Warrior NFT have the unique opportunity to mine the tokens successfully launched from the RobotPump platform.</div>
        <Button variant="bordered" className="w-[200px]" color="primary" as={Link} href="https://www.0xrobot.ai/nft">Join Now !</Button>
      </div>
    </main>
  );
};

export default Mining;
