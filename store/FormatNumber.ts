import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';
import { helper } from '../lib/helper';

export class FormatNumber {
  private _value: BigNumber;
  private _format: string;
  private _loading: boolean;
  private _decimals: number;
  private _formatter?: Function;

  constructor({ value = new BigNumber(0), format = '', loading = false, decimals = 18, formatter }: Partial<FormatNumber> = {}) {
    this._value = value;
    this._format = format;
    this._loading = loading;
    this._decimals = decimals;
    this._formatter = formatter;
    makeAutoObservable(this);
  }

  get value(): BigNumber {
    return this._value;
  }

  get format(): string {
    return this._format;
  }

  get loading(): boolean {
    return this._loading;
  }

  get decimals(): number {
    return this._decimals;
  }

  get formatter(): Function | undefined {
    return this._formatter;
  }

  setDecimals(decimals: number): void {
    this._decimals = decimals;
  }

  setValue(value: BigNumber): void {
    this._value = value;
    this.updateFormatFromValue();
    this.setLoading(false);
  }

  setFormat(format: string): void {
    this._format = format;
    this._value = new BigNumber(format).multipliedBy(10 ** this._decimals);
  }

  setLoading(loading: boolean): void {
    this._loading = loading;
  }

  private updateFormatFromValue(): void {
    this._format = helper.number.wrapNumber(this._value.toFixed(), this._decimals, {
      format: '0.0000000',
      fallback: '',
    }).format;
  }
}
