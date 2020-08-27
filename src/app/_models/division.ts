import { User } from "./user";

export class Division {
  id: string;
  name: string;
  children: Array<Division>;
  created: Date;
  user: User;
  individualDivision: boolean;
}

export class CreateDivision {
  name: string;
  parentIds: Array<string>;
  childrenIds: Array<string>;
}
