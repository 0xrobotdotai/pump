import React from "react";
import clsx from "clsx";
import { Image } from "@nextui-org/image";

interface EmptyResultProps {
  onReload?: () => void;
  className?: string;
}

const EmptyResult: React.FC<EmptyResultProps> = React.memo(
  ({ className }) => {
    return (
      <div
        className={clsx(
          "text-center flex flex-col items-center justify-center gap-5 w-full h-[500px] opacity-50",
          className
        )}
      >
        <Image src="/imgs/logo.svg" alt="" style={{ width: "100px", height: "100px" }} />
        <div className="text-white/80 text-lg font-semibold">NO TOKENS</div>
      </div>
    );
  }
);

EmptyResult.displayName = "EmptyResult";

export default EmptyResult;
