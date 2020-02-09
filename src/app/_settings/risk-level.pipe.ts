import { Pipe, PipeTransform } from "@angular/core";
/*
 * Converts to a risk or residual level from a number
*/
@Pipe({
    name: "risklevel"
})
export class RiskLevelPipe implements PipeTransform {
  transform(value: number) {
    switch (value) {
      case 1:
        return `<ion-badge class="risk-low">Low (1)</ion-badge>`;
      case 2:
        return `<ion-badge class="risk-moderate">Moderate (2)</ion-badge>`;
      case 3:
        return `<ion-badge class="risk-medium">Medium (3)</ion-badge>`;
      case 4:
        return `<ion-badge class="risk-high">High (4)</ion-badge>`;
      case 5:
        return `<ion-badge class="risk-extreme">Extreme (5)</ion-badge>`;
      default:
        return `<ion-badge color="primary">Internal</ion-badge>`;
    }
  }
}