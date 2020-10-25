import {
  Component,
  Input,
  OnInit
} from "@angular/core";
import { DivisionList } from '@shared/models/division-list';
import { DivisionNode } from '@shared/models/division-node';

@Component({
  selector: "division-item",
  templateUrl: "./division-item.component.html",
  styleUrls: ["./division-item.component.scss"],
})
export class DivisionItemComponent implements OnInit {
  @Input() public divNode: DivisionNode;
  @Input() public divisionList: DivisionList;
  @Input() public readonly?: boolean = false;

  public showChildren = false;

  constructor() {}

  ngOnInit() {
    this.showChildren = this.divisionList.asFilter && this.divNode.checked
  }

  public toggle(divNode: DivisionNode): void {
    this.divisionList.toggle(divNode);

    this.showChildren = this.divisionList.asFilter && this.divNode.checked
  }

  public toggleShow() {
    this.showChildren = !this.showChildren;
  }
}
