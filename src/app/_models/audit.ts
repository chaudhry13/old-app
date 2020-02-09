import { Attachment } from "./file";

export class Audit {
  id: string;
  controlId: string;
  title: string;
  description: string;
  date: string;
  remarks?: string;
  other?: string;
  followUp: boolean;
  followUpId: string;
  late: boolean;
  completed: boolean;
  completedAt: Date;
  completedById: string;
  location: boolean;
  latitude: number;
  longitude: number;
  files: Attachment[];

  constructor() {
    this.files = new Array<Attachment>();
  }
}
