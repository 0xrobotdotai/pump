import { makeAutoObservable, runInAction } from "mobx";

export class GlobalStore {
  isMobileMenuOpen: boolean = false;
  shouldMobileTabOpen: boolean = true;
  shouldSubNavbarOpen: boolean = false;
  subNavbarTitle: string = "";
  isReady: boolean = false;
  isHowItWorksModalOpen: boolean = false;
  howItWorksStep: number = 1;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setData(v: Partial<GlobalStore>) {
    Object.assign(this, v);
  }

  closeHowItWorksModal(): void {
    if (!this.isReady) {
      this.isReady = true;
    }
    this.isHowItWorksModalOpen = false;
  }

  openHowItWorksModal(): void {
    this.isHowItWorksModalOpen = true;
  }
}
