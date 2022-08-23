import {DropDownBuildingComponent, DropDownOptions} from "./dropdown-building-component";
import {NumberBuildingComponent, NumberOptions} from "./number-building-component";
import {DateBuildingComponent, DateOptions} from "./date-buliding-component";
import {LocationBuildingComponent, LocationOptions} from "./location-component";
import {TextBuildingComponent, TextOptions} from "./text-building-component";
import {TextAreaBuildingComponent, TextAreaOptions} from "./text-area-buildingcomponent";
import {AutofillLogic, DisplayLogic} from "../form-logic";

export class BuildingComponent {
    id: string;
    label: string;
    type: BuildingComponentType;
    index: number;
    isFilter: boolean;
    required: boolean;
    displayLogic: DisplayLogic[];
    autofillLogic: AutofillLogic[];

    constructor() {
        this.id = null;
        this.label = null;
        this.type = null;
        this.index = null;
        this.displayLogic = [];
        this.autofillLogic = [];
        this.isFilter = false;
        this.required = false;
    }

    static childFieldsFactory(val: BuildingComponentUnion): [string, OptionsUnion] {
        if (val.type === BuildingComponentType.Dropdown) {
            const extendedBase = val as DropDownBuildingComponent;
            return ['dropDownOptions',extendedBase.dropDownOptions];
        } else if (val.type === BuildingComponentType.Number) {
            const extendedBase = <NumberBuildingComponent>val;
            return ['numberOptions',extendedBase.numberOptions];
        } else if (val.type === BuildingComponentType.Date) {
            const extendedBase = <DateBuildingComponent>val;
            return ['dateOptions',extendedBase.dateOptions];
        } else if (val.type === BuildingComponentType.Location) {
            const extendedBase = <LocationBuildingComponent>val;
            return ['locationOptions',extendedBase.locationOptions];
        } else if (val.type === BuildingComponentType.Text) {
            const extendedBase = <TextBuildingComponent>val;
            return ['textOptions',extendedBase.textOptions];
        } else if (val.type === BuildingComponentType.TextArea) {
            const extendedBase = <TextAreaBuildingComponent>val;
            return ['textAreaOptions', extendedBase.textAreaOptions];
        }
    }
}

export enum BuildingComponentType {
    Text, // Created
    TextArea, // Created
    Number, // Created
    Location, // Next
    Dropdown, // Created
    Date, // Next
    //FileUpload, //
}

export namespace BuildingComponentType {
    export function getReadableName(type: BuildingComponentType): string {
        switch (type) {
            case BuildingComponentType.Text:
                return 'Text';
            case BuildingComponentType.TextArea:
                return 'Text Area';
            case BuildingComponentType.Number:
                return 'Number';
            case BuildingComponentType.Location:
                return 'Location';
            case BuildingComponentType.Dropdown:
                return 'Dropdown';
            case BuildingComponentType.Date:
                return 'Date';
            // case BuildingComponentType.FileUpload:
            //   return 'File Upload';
            default:
                return 'Not found';
        }
    }
}

export type BuildingComponentUnion =
    | TextBuildingComponent
    | DropDownBuildingComponent
    | NumberBuildingComponent
    | LocationBuildingComponent
    | DateBuildingComponent
    | TextAreaBuildingComponent;

export type OptionsUnion =
    | TextOptions
    | DropDownOptions
    | NumberOptions
    | LocationOptions
    | DateOptions
    | TextAreaOptions;
