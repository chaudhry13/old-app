import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlacesSearchService } from "@app/services/places-search.service";
import { LocationService } from "@app/services/location.service";
import { UserService } from "@app/services/user.service";
import { ToastService } from "@app/services/toast.service";
import { StorageService } from "@app/services/storage.service";
import { CameraService } from "@app/services/photo.service";
import { MapService } from "@app/services/maps.service";
import { GeocodingService } from "@app/services/geocoding.service";
import { DivisionService } from "@app/services/division.service";
import { DeeplinkService } from "@app/services/deeplink.service";
import { CronService } from "@app/services/cron.service";
import { AppConfigService } from "@app/services/auth-config.service";
import { AccountService } from "@app/services/account.service";
import { TokenService } from "@app/services/token.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    PlacesSearchService,
    LocationService,
    UserService,
    TokenService,
    ToastService,
    StorageService,
    CameraService,
    MapService,
    GeocodingService,
    DivisionService,
    CronService,
    AppConfigService,
    AccountService,
  ],
})
export class CoreModule {}