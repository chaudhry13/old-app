import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Country } from 'src/app/_models/country';
import { Division } from 'src/app/_models/division';
import { LocationViewModel } from 'src/app/_models/location';
import { User } from 'src/app/_models/user';
import { DivisionService } from 'src/app/_services/division.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'investigation-report-form',
  templateUrl: './investigation-report-form.component.html',
  styleUrls: ['./investigation-report-form.component.scss']
})
export class InvestigationReportFormComponent implements OnInit {
  @Input() incidentForm: FormGroup;

  public users: User[];
  public divisions: Division[];
  public currentDate: string = new Date().toISOString();

  constructor(
    private divisionService: DivisionService,
    private userService: UserService) { }

  ngOnInit() {
    this.getDataToPopulateForm();
  }

  public onPersonsFormChanges(persons) {
    this.incidentForm.get("persons").setValue(persons);
  }

  private getDataToPopulateForm() {
    this.getUsersFromDivisions();
  }

  private getUsersFromDivisions(): void {
    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
      this.getUsers(divisions);
    });
  }

  private getUsers(divisions: Division[]) {
    this.userService.list(divisions.map(division => division.id), null).subscribe(users => {
      this.users = users;
    });
  }
}
