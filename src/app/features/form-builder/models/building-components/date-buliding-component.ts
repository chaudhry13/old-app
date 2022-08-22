import { BuildingComponent, BuildingComponentType } from './building-component';

export class DateBuildingComponent extends BuildingComponent {
  dateOptions: DateOptions;

  constructor() {
    super();
    this.type = BuildingComponentType.Date;
    this.dateOptions = {
      value: null,
    };
  }
}

export interface DateOptions {
  value: string;
}
