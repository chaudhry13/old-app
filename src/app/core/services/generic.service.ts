import { AppConfigService } from "./auth-config.service";
import { AppConfig } from "../settings/auth.config";

export class GenericService {
  private extension: string;
  public appConfigService: AppConfigService;
  public appConfig: AppConfig = new AppConfig();
  constructor(extension: string = "", appConfigService: AppConfigService) {
    this.extension = extension;
    this.appConfigService = appConfigService;
    appConfigService.loadAppConfig().then();
  }

  public get apiBase() {
    return this.appConfigService.getApiBaseUrl + "/api" + this.extension;
  }
}
