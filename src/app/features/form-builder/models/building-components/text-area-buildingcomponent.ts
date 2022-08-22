import { BuildingComponent, BuildingComponentType } from './building-component';

export class TextAreaBuildingComponent extends BuildingComponent {
  textAreaOptions: TextAreaOptions;

  constructor() {
    super();
    this.type = BuildingComponentType.TextArea;
    this.textAreaOptions = {
      value: null,
    };
  }
}

export interface TextAreaOptions {
  value: string;
}
