import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { DivisionService } from 'src/app/core/services/division.service';
import { User } from 'src/app/core/models/user';
import { Division } from 'src/app/core/models/division';

@Component({
  selector: 'investigation-filter',
  templateUrl: './investigation-filter.component.html',
  styleUrls: ['./investigation-filter.component.scss']
})
export class InvestigationFilterComponent implements OnInit {

  @Input() incidentFilterForm: FormGroup;

  public users: User[];
  public showFilters: boolean = false;

  constructor(
    private userService: UserService,
    private divisionService: DivisionService
  ) { }

  ngOnInit() {
    this.getUsersFromDivisions();
  }

  private getUsersFromDivisions(): void {
    this.divisionService.list().then(divisions => {
      this.getUsers(divisions);
    });
  }

  private getUsers(divisions: Division[]) {
    this.userService.list(divisions.map(division => division.id), null).subscribe(users => {
      this.users = users;
    });
  }

  public toggleShowFilters() {
    this.showFilters = !this.showFilters;
  }

}
