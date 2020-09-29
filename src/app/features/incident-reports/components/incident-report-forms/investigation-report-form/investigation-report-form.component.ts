import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Country } from '@app/models/country';
import { Division } from '@app/models/division';
import { LocationViewModel } from '@app/models/location';
import { User } from '@app/models/user';
import { DivisionService } from '@app/services/division.service';
import { UserService } from '@app/services/user.service';

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
