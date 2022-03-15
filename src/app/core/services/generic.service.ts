import { OrgConfig } from "@app/interfaces/org-config";
import { AppConfigService } from "./app-config.service";

export class GenericService {
  private extension: string;
  constructor(
    extension: string = "",
    public appConfigService: AppConfigService
  ) {
    this.extension = extension;
  }

  public get apiBase() {
    return this.appConfigService.orgConfig.apiServer + "/api" + this.extension;
  }
}
