import {Component, Input, OnInit} from "@angular/core";
import {DropDownBuildingComponent} from "../../models/building-components/dropdown-building-component";
import {BuildingComponent, BuildingComponentUnion} from "../../models/building-components/building-component";

@Component({
    selector: "app-parse-view",
    template: `
    <ion-card-header>
        <ion-card-subtitle>{{bc.label}}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
       <div> {{parse(bc)}} </div>
    </ion-card-content>
    
  `,
})
export class ParseViewComponent implements OnInit {
    @Input() bc: BuildingComponentUnion;

    constructor() { }

    ngOnInit(): void {
    }

    parse(bc: BuildingComponentUnion) {
        const options: any = BuildingComponent.childFieldsFactory(bc)[1];
        return options.value;
    }

}
