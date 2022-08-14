import {User} from "@app/models/user";

export interface FormListItem {
    id: string;
    name: string;
    type: number;
    created: Date;
    createdBy: User;
}
