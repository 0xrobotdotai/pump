import { Image } from "@nextui-org/image";
import { motion } from "framer-motion";
import React from "react";

const MLoading = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <Image src="/imgs/logo.svg" alt="loading" className="shake" style={{ width: "150px", height: "150px" }} />
      <div className="mt-5 font-semibold text-lg">Waiting...</div>
    </div>
  );
};

export default MLoading;
