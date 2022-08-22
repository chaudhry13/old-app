import {User} from "@app/models/user";

export class HrForm {
    id: string;
    name: string;
    description: string;
    created: Date;
    updated: Date;
    createdBy: User;
    type: HrFormType;
}

export enum HrFormType {
    "Incident Report",
    "Activity Report",
    "Custom",
}
