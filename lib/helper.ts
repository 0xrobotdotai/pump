import numeral from "numeral";
import BigNumber from "bignumber.js";

export const helper = {
  shortaddress(address: string, frontLen: number = 4, backLen: number = 4): string {
    const middle = frontLen > 0 ? "..." : "";
    return `${address.slice(0, frontLen)}${middle}${address.slice(-backLen)}`;
  },
  number: {
    countSignificantDigits(str: string): number {
      const match = str.match(/[^0.]/);
      return match ? str.length - str.indexOf(match[0]) : 0;
    },
    formatWithPrecision(value: number | string, options: { decimals?: number; format?: string; toLocalString?: boolean } = {}): string {
      const { decimals = 6, format = "", toLocalString = false } = options;
      const num = new BigNumber(value);
      if (!num.isFinite()) return "";

      const scaled = num.toFixed(decimals, BigNumber.ROUND_DOWN);
      if (format) return numeral(Number(scaled)).format(format);
      return toLocalString ? Number(scaled).toLocaleString() : scaled;
    },
    wrapNumber(value: string, decimals: number = 18, options: { format?: string; fallback?: string; min?: number } = {}) {
      const { format = "0.0", fallback = "0.000", min } = options;
      if (!value) {
        return {
          value: "...",
          format: "...",
          decimals: "0",
          isZero: true,
        };
      }

      const num = new BigNumber(value).dividedBy(10 ** decimals);
      const formatted = helper.number.formatNumber(num.toFixed(), format, { fallback, min });
      return {
        value: num.toFixed(),
        format: formatted,
        decimals: decimals.toString(),
        isZero: num.isZero(),
      };
    },
    formatNumber(value: string | number, format: string = "0,0", options: { min?: number; fallback?: string } = {}): string {
      const { fallback = "0.00", min } = options;
      const num = new BigNumber(value);

      if (!num.isFinite()) return fallback;
      if (min && num.isLessThan(min)) return `< ${numeral(min).format(format)}`;

      return numeral(num.toFixed())
        .format(format)
        .replace(/\.?0+$/, "");
    },
    addThousandsSeparators(value: number | string): string {
      const [integer, fraction] = value.toString().split(".");
      const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return fraction ? `${formattedInteger}.${fraction}` : formattedInteger;
    },
  },
};
