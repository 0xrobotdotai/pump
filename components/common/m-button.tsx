import {Button} from "@nextui-org/button";
import { extendVariants } from "@nextui-org/system";

export const MButton = extendVariants(Button, {
  variants: {
    color: {
      base: "text-primary bg-transparent border border-white/10",
      normal: "text-primary bg-transparent border border-white/10",
      tabActive: 'bg-primary border border-white/10 font-semibold',
      tab: 'border border-white/10 font-semibold',
      sell: 'bg-[#EE4266] border-[#EE4266] font-semibold',
      info: 'border border-white/10',
      action: 'text-primary border border-primary',
      percent: 'text-primary bg-default-200 border border-bgSecondary',
    },
    isDisabled: {
      true: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed",
    },
    size: {
      xs: "px-2 py-1 h-[1.5rem] text-xs gap-1 rounded-[0.25rem] min-w-max	",
      md: "px-4 py-[0.625rem] min-w-20 text-small gap-2 rounded-[0.25rem]",
      xl: "px-6 py-3 min-w-28 text-base gap-[0.625rem] rounded-[0.25rem]",
      lg: "text-sm rounded-[0.25rem] font-semibold"
    },
    hover: {
      true: "hover:bg-transparent hover:border-primary",
    }
  },
  defaultVariants: {
    color: "base",
    size: "md",
  },
  compoundVariants: [
    {
      isDisabled: true,
      color: "base",
      class: "bg-transparent opacity-100",
    },
  ],
});