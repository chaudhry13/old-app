import { Component, OnInit } from "@angular/core";
import { BuildingComponent, BuildingComponentType } from "./building-component";

export class FileUploadBuildingComponent extends BuildingComponent {

  constructor() {
    super();
    //this.type = BuildingComponentType.FileUpload; //TODO: NOT YET IMPLEMENTED
  }
}
