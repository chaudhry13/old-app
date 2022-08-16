import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {BuildingComponent, BuildingComponentUnion} from "../../models/building-components/building-component";
import {LocationBuildingComponent} from "../../models/building-components/location-component";
import {AgmMap} from "@agm/core";
import {CountryService} from "@app/services/country.service";
import {Country} from "@shared/models/country";

@Component({
    selector: "app-location-view",
    template: `
        <ion-card-subtitle class="ion-padding"> {{ bc.label }} </ion-card-subtitle>
        <ion-grid class="ion-no-padding ion-margin-bottom">
            <ion-row>
                <ion-col offset-4 *ngIf="bc.locationOptions.address">
                    <ion-item lines="none">
                        <ion-label position="stacked">Address</ion-label>
                        <ion-label position="stacked">{{ bc.locationOptions.address }}</ion-label>
                    </ion-item>
                </ion-col>
                <ion-col *ngIf="bc.locationOptions.countryId">
                    <ion-item lines="none">
                        <ion-label position="stacked">Country</ion-label>
                        <ion-label position="stacked"
                        >{{ country?.name }}
                        </ion-label>
                    </ion-item>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-item lines="none">
                        <ion-label position="stacked">Latitude</ion-label>
                        <ion-label position="stacked" readonly>{{ bc.locationOptions.latitude }}</ion-label>
                    </ion-item>
                </ion-col>
                <ion-col offset-4>
                    <ion-item lines="none">
                        <ion-label position="stacked">Longitude</ion-label>
                        <ion-label position="stacked" readonly>{{ bc.locationOptions.longitude }}</ion-label>
                    </ion-item>
                </ion-col>
            </ion-row>
        </ion-grid>

        <agm-map #map
                 [latitude]="bc.locationOptions.latitude *1"
                 [longitude]="bc.locationOptions.longitude *1"> <!-- For some reason, the lat lng is not numbers if checking with "typeof" -->
            <agm-marker
                    [latitude]="bc.locationOptions.latitude *1"
                    [longitude]="bc.locationOptions.longitude *1"
            ></agm-marker>
        </agm-map>



    `,
})
export class LocationViewComponent implements OnInit {
    @Input() bc: LocationBuildingComponent;
    @ViewChild("map") myMap: AgmMap;
    public country: Country;

    constructor(private countryService: CountryService) {
    }

    ngOnInit(): void {
        this.countryService.list().subscribe(x =>
        this.country = x.find(y => y.id.toString() === this.bc.locationOptions.countryId))
    }

    parse(bc: BuildingComponentUnion) {
        const options: any = BuildingComponent.childFieldsFactory(bc)[1];
        return options.value;
    }

}