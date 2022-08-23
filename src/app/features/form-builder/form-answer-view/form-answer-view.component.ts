import {Component, Input, OnInit} from '@angular/core';
import {FormDto} from "../models/form.dto";
import {BuildingComponentType, BuildingComponent, BuildingComponentUnion} from "../models/building-components/building-component";

@Component({
  selector: 'app-form-answer-view',
  templateUrl: './form-answer-view.component.html',
  styleUrls: ['./form-answer-view.component.scss'],
})
export class FormAnswerViewComponent implements OnInit {
  @Input() formDto: FormDto;

  BuildingComponentType = BuildingComponentType;

  constructor() { }

  ngOnInit() {}

  parse(bc: BuildingComponentUnion) {
    const options: any = BuildingComponent.childFieldsFactory(bc)[1];
    return options.value;
  }

}
