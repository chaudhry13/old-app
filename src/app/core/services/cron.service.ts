import cronstrue from "cronstrue";
import { Injectable } from "@angular/core";

@Injectable()
export class CronService {
  constructor() {}

  parse(cron: string): string {
    var result = cronstrue.toString(cron, { use24HourTimeFormat: true });

    return result;
  }
}
