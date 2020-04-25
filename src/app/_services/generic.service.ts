import { AppConfigService } from './auth-config.service';
import { AuthConfig } from 'angular-oauth2-oidc';
import { AppConfig } from '../_settings/auth.config';

export class GenericService {
  private extension: String;
  public appConfigService: AppConfigService;
  public appConfig: AppConfig = new AppConfig();
  constructor(_extension: string = "", _appConfigService: AppConfigService) {
    this.extension = _extension;
    this.appConfigService = _appConfigService;
    _appConfigService.loadAppConfig();
  }

  public get apiBase() {
    return this.appConfigService.getApiBaseUrl + "/api" + this.extension;
  }
}