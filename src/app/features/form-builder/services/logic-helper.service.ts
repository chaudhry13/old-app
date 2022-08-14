import { Injectable } from '@angular/core';
import {
  AutofillLogic,
  DisplayLogic,
  DropdownLogic,
  DropdownOperator,
  NumberLogic,
  NumberOperator, TextLogic,
  TextOperator
} from '../models/form-logic';
import {BuildingComponentType, BuildingComponentUnion} from "../models/building-components/building-component";
import {TextBuildingComponent} from "../models/building-components/text-building-component";
import {TextAreaBuildingComponent} from "../models/building-components/text-area-buildingcomponent";
import {DropDownBuildingComponent} from "../models/building-components/dropdown-building-component";
import {NumberBuildingComponent} from "../models/building-components/number-building-component";

@Injectable({
  providedIn: 'root',
})
export class LogicHelperService {
  private readonly textOperators = new Map<TextOperator, (x: BuildingComponentUnion) => boolean>();
  private readonly textAreaOperators = new Map<TextOperator, (x: BuildingComponentUnion) => boolean>();
  private readonly numberOperators = new Map<
      NumberOperator,
      (x: BuildingComponentUnion, logic: NumberLogic) => boolean
      >();
  private readonly dropdownOperators = new Map<
      DropdownOperator,
      (x: BuildingComponentUnion, logic: DropdownLogic) => boolean
      >();
  private readonly componentTypes = new Map<
      BuildingComponentType,
      (x: DisplayLogic | AutofillLogic, bc: BuildingComponentUnion) => boolean
      >();

  constructor() {
    this.registerAllComponentTypes();
    this.registerAllTextOperators();
    this.registerAllDropdownOperators();
    this.registerAllNumberOperators();
    this.registerAllTextAreaOperators();
  }

  public logicSolverFactory(type: BuildingComponentType) {
    return this.componentTypes.get(type);
  }

  private registerAllTextOperators() {
    this.textOperators.set(
        TextOperator['Is not empty'],
        (blockUnderEval: BuildingComponentUnion) => !!(<TextBuildingComponent>blockUnderEval).textOptions.value
    );
    this.textOperators.set(
        TextOperator['Is empty'],
        (blockUnderEval: BuildingComponentUnion) => !(<TextBuildingComponent>blockUnderEval).textOptions.value
    );
  }

  private registerAllTextAreaOperators() {
    this.textAreaOperators.set(
        TextOperator['Is not empty'],
        (blockUnderEval: BuildingComponentUnion) => !!(<TextAreaBuildingComponent>blockUnderEval).textAreaOptions.value
    );
    this.textAreaOperators.set(
        TextOperator['Is empty'],
        (blockUnderEval: BuildingComponentUnion) => !(<TextAreaBuildingComponent>blockUnderEval).textAreaOptions.value
    );
  }

  private registerAllDropdownOperators() {
    this.dropdownOperators.set(
        DropdownOperator["Has the following selected"],
        (blockUnderEval: BuildingComponentUnion, logic: DropdownLogic) => {
          const dropdown = blockUnderEval as DropDownBuildingComponent;

          if (dropdown.dropDownOptions.value?.includes(logic.value)) {
            return true;
          } else {
            return false;
          }
        }
    );
  }

  private registerAllNumberOperators() {
    this.numberOperators.set(
        NumberOperator['Is greater than'],
        (blockUnderEval: BuildingComponentUnion, logic: NumberLogic) => {
          const number = blockUnderEval as NumberBuildingComponent;

          return number.numberOptions.value > logic.value;
        }
    );

    this.numberOperators.set(NumberOperator['Is less than'], (blockUnderEval: BuildingComponentUnion, logic: NumberLogic) => {
      const number = blockUnderEval as NumberBuildingComponent;
      return number.numberOptions.value < logic.value;
    });

    this.numberOperators.set(NumberOperator['Is equal to'], (blockUnderEval: BuildingComponentUnion, logic: NumberLogic) => {
      const number = blockUnderEval as NumberBuildingComponent;
      return number.numberOptions.value === logic.value;
    });
  }

  private registerAllComponentTypes() {
    this.componentTypes.set(
        BuildingComponentType.Text,
        (x: DisplayLogic | AutofillLogic, bc: BuildingComponentUnion) => {
          const logic = x.dynamicLogic as TextLogic;
          const solveTextLogic = this.textOperators.get(logic.operator);
          return solveTextLogic(bc);
        }
    );
    this.componentTypes.set(
        BuildingComponentType.TextArea,
        (x: DisplayLogic | AutofillLogic, bc: BuildingComponentUnion) => {
          const logic = x.dynamicLogic as TextLogic;
          const solveTextLogic = this.textAreaOperators.get(logic.operator);
          return solveTextLogic(bc);
        }
    );
    this.componentTypes.set(
        BuildingComponentType.Dropdown,
        (x: DisplayLogic | AutofillLogic, bc: BuildingComponentUnion) => {
          const logic = x.dynamicLogic as DropdownLogic;
          const solveDropdownLogic = this.dropdownOperators.get(logic.operator);
          return solveDropdownLogic(bc, logic);
        }
    );

    this.componentTypes.set(
        BuildingComponentType.Number,
        (x: DisplayLogic | AutofillLogic, bc: BuildingComponentUnion) => {
          const logic = x.dynamicLogic as NumberLogic;
          const solveNumberLogic = this.numberOperators.get(logic.operator);
          return solveNumberLogic(bc, logic);
        }
    );
  }
}