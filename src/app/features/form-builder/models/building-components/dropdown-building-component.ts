import { BuildingComponent, BuildingComponentType } from './building-component';

export class DropDownBuildingComponent extends BuildingComponent {
  dropDownOptions: DropDownOptions;

  constructor() {
    super();
    this.type = BuildingComponentType.Dropdown;
    this.dropDownOptions = {
      clearable: null,
      multiple: null,
      options: [],
      value: null,
    };
  }
}

export interface DropDownListItem {
  id: string;
  label: string;
  index: number;
}

export interface DropDownOptions {
  options: DropDownListItem[];
  value: string;
  clearable: boolean;
  multiple: boolean;
}
