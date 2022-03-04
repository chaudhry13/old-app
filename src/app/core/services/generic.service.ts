import { AppConfigService } from "./app-config.service";
import { AppConfig } from "../settings/auth.config";

export class GenericService {
  private extension: string;
  constructor(
    extension: string = "",
    public appConfigService: AppConfigService
  ) {
    this.extension = extension;
  }

  public get apiBase() {
    return this.appConfigService.apiUrl + "/api" + this.extension;
  }
}
