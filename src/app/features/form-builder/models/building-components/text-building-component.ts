import { BuildingComponent, BuildingComponentType } from './building-component';

export class TextBuildingComponent extends BuildingComponent {
  textOptions: TextOptions;
  constructor() {
    super();
    this.type = BuildingComponentType.Text;
    this.textOptions = {
      value: null,
    };
  }
}

export interface TextOptions {
  value: string;
}
