import {Component, Input, OnInit} from "@angular/core";
import {
    BuildingComponent,
    BuildingComponentType,
    BuildingComponentUnion
} from "../../models/building-components/building-component";

@Component({
    selector: "app-parse-view",
    template: `
    <ion-card-header>
        <ion-card-subtitle>{{bc.label}}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
       <div *ngIf="bc.type !== BuildingType.Date"> {{parse(bc)}} </div>
       <div *ngIf="bc.type === BuildingType.Date"> {{parse(bc) | date: "MMM dd, yyyy"}} </div>
    </ion-card-content>
    
  `,
})
export class ParseViewComponent implements OnInit {
    @Input() bc: BuildingComponentUnion;
    BuildingType = BuildingComponentType;

    constructor() { }

    ngOnInit(): void {
    }

    parse(bc: BuildingComponentUnion) {
        const options: any = BuildingComponent.childFieldsFactory(bc)[1];
        return options.value;
    }

}
