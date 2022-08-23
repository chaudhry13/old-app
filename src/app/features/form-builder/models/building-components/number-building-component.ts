import { BuildingComponent, BuildingComponentType } from './building-component';

export class NumberBuildingComponent extends BuildingComponent {
  numberOptions: NumberOptions;

  constructor() {
    super();
    this.type = BuildingComponentType.Number;
    this.numberOptions = {
      minValue: null,
      maxValue: null,
      value: null,
    };
  }
}

export interface NumberOptions {
  minValue: number;
  maxValue: number;
  value: number;
}
