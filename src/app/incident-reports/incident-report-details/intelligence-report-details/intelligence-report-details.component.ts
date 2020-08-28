import { Component, OnInit, Input } from '@angular/core';
import { IncidentReport, PersonsViewModel, Genders, Build, VehiclesViewModel, VehicleMakes, VehicleModels, VehicleColor } from 'src/app/_models/incident-report';

@Component({
  selector: 'intelligence-report-details',
  templateUrl: './intelligence-report-details.component.html',
  styleUrls: ['./intelligence-report-details.component.scss']
})
export class IntelligenceReportDetailsComponent implements OnInit {

  @Input() incidentReport: IncidentReport;

  public personsShown: PersonsViewModel[] = [];
  public vehiclesShown: VehiclesViewModel[] = [];

  public personGender = Genders;
  public personBuild = Build;

  public vehicleMake = VehicleMakes;
  public vehicleModel = VehicleModels;
  public vehicleColor = VehicleColor;

  constructor() { }

  ngOnInit() {
    this.incidentReport.persons.forEach(person => {
      var i = 0;
      this.personsShown.push({ index: i, shown: false });
      i++;
    });

    this.incidentReport.vehicles.forEach(vehicle => {
      var i = 0;
      this.vehiclesShown.push({ index: i, shown: false });
      i++;
    });

    console.log(this.incidentReport.vehicles);
  }

  toggleShowOfIndex(index: number, listType: string) {
    if (listType == "person")
      this.personsShown[index].shown = !this.personsShown[index].shown;
    else if (listType == "vehicle")
      this.vehiclesShown[index].shown = !this.vehiclesShown[index].shown;
  }

}
