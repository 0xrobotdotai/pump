import BigNumber from 'bignumber.js';
import { makeAutoObservable } from 'mobx';
import { helper } from '@/lib/helper';

export class NumericState {
  private _value: BigNumber;
  private _loading: boolean;
  private _decimals: number;
  private _fixed: number;
  private _formatter?: (state: NumericState) => string;

  constructor({ value = new BigNumber(0), loading = false, decimals = 6, fixed = 6, formatter }: Partial<NumericState> = {}) {
    this._value = value;
    this._loading = loading;
    this._decimals = decimals;
    this._fixed = fixed;
    this._formatter = formatter;
    makeAutoObservable(this);
  }

  // Getters
  get value(): BigNumber {
    return this._value;
  }

  get loading(): boolean {
    return this._loading;
  }

  get decimals(): number {
    return this._decimals;
  }

  get fixed(): number {
    return this._fixed;
  }

  get formatter(): ((state: NumericState) => string) | undefined {
    return this._formatter;
  }

  get formattedValue(): string {
    return this._loading ? '...' : this.calculateFormattedValue();
  }

  get formattedWithCommas(): string {
    return this._loading ? '...' : helper.number.addThousandsSeparators(this.calculateFormattedValue());
  }

  // Private methods
  private calculateFormattedValue({ fixed = this._fixed }: { decimals?: number; fixed?: number } = {}): string {
    if (this._loading) return '...';
    if (this._formatter) return this._formatter(this);

    const scaledValue = this._value.dividedBy(10 ** this._decimals);
    return helper.number.formatWithPrecision(scaledValue.toFixed(), { decimals: fixed });
  }

  // State update methods
  updateDecimals(decimals: number): void {
    this._decimals = decimals;
  }

  updateValue(value: BigNumber): void {
    this._value = value;
    this.setLoading(false);
  }

  setFixed(fixed: number): void {
    this._fixed = fixed;
  }

  setFormatter(formatter: (state: NumericState) => string): void {
    this._formatter = formatter;
  }

  setLoading(isLoading: boolean): void {
    this._loading = isLoading;
  }
}
