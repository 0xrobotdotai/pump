import { makeAutoObservable } from "mobx";

export class TemplateStore {
  count = 0;
  constructor() {
    makeAutoObservable(this);
  }

  increment = () => {
    this.count++;
  };
}
