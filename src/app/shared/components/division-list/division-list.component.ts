import { Component, Input, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { DivisionList } from '@shared/models/division-list';

@Component({
  selector: "division-list",
  templateUrl: "./division-list.component.html",
  styleUrls: ["./division-list.component.scss"],
})
export class DivisionListComponent implements OnInit {
  @Input() public divisionList: DivisionList;
  @Input() public readonly?: boolean = false;

  constructor(
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
  }
}
