import { BuildingComponentType } from "./building-components/building-component";

export class DisplayLogic {
    selectedField: string;
    type: BuildingComponentType;
    dynamicLogic: LogicUnion;

    constructor() {
        this.selectedField = null;
        this.dynamicLogic = null;
    }
}

export class AutofillLogic {
    selectedField: string;
    type: BuildingComponentType;
    dynamicLogic: LogicUnion;
    autofillValue: string;

    constructor() {
        this.selectedField = null;
        this.dynamicLogic = null;
    }
}

export class DropdownLogic {
    operator: DropdownOperator;
    value: string;

    constructor() {
        this.operator = null;
        this.value = null;
    }
}

export class TextLogic {
    operator: TextOperator;

    constructor() {
        this.operator = null;
    }
}

export class NumberLogic {
    operator: NumberOperator;
    value: number;

    constructor() {
        this.operator = null;
        this.value = null;
    }
}

export enum DropdownOperator {
    'Has the following selected',
}

export enum TextOperator {
    'Is not empty',
    'Is empty',
}

export enum NumberOperator {
    'Is greater than',
    'Is less than',
    'Is equal to',
}

export type LogicUnion = DropdownLogic | TextLogic | NumberLogic;
