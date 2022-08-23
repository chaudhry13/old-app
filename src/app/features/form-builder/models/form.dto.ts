import {HrFormType} from "./hr-form";
import {User} from "@app/models/user";
import {BuildingComponentUnion} from "./building-components/building-component";

export interface FormDto {
    id: string;
    name: string;
    type: HrFormType;
    description:string;
    isTemplate: boolean;
    formSections: FormSectionDto[];
    divisionIds: string[];
    templateReference: FormDto;
    created: Date;
    createdBy: User;
}

export interface FormSectionDto {
    id: string;
    name: string;
    buildingComponents: BuildingComponentUnion[];
}
