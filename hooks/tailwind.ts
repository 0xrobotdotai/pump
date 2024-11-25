import { create } from "@kodingdotninja/use-tailwind-breakpoint";
import resolveConfig from "tailwindcss/resolveConfig";

const config = resolveConfig(require("../tailwind.config.js"));

export const { useBreakpoint } = create(config.theme.screens);
