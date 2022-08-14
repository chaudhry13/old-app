import { Injectable } from '@angular/core';
import {BuildingComponent, BuildingComponentType} from "../models/building-components/building-component";
import {DropdownLogic} from "../models/form-logic";
import {HrFormType} from "../models/hr-form";
import {FormDto} from "../models/form.dto";
import {DropDownOptions} from "../models/building-components/dropdown-building-component";

@Injectable({
  providedIn: 'root'
})
export class FormHelperService {

  resetAllIdsButKeepRefs = (x: FormDto) => {
    if (!x) return x;
    // because we reset the ids of all the elements, we need to keep track of changes
    // and update the refs. The only place this is currently is on the logic.
    const bcMap = new Map<string, string>();
    const optionMap = new Map<string, string>();

    x.id = uuidv4();
    x.formSections.forEach(s => {
      s.id = uuidv4();
      s.buildingComponents.forEach(b => {
        const newId = uuidv4();
        bcMap.set(b.id, newId);
        b.id = newId;
        const [key, options] = BuildingComponent.childFieldsFactory(b);

        if (b.type === BuildingComponentType.Dropdown) {
          (<DropDownOptions>options).options?.forEach(o => {
            const newOptionId = uuidv4();
            optionMap.set(o.id, newOptionId);
            o.id = newOptionId;
          });
        }
      });
    });

    // Go through all the logic, and update the refs.
    x.formSections.forEach(s => {
      s.buildingComponents.forEach(b => {
        b.displayLogic.forEach(l => {
          l.selectedField = bcMap.get(l.selectedField);
          if(l.type === BuildingComponentType.Dropdown) {
            (<DropdownLogic>l.dynamicLogic).value = optionMap.get((<DropdownLogic>l.dynamicLogic).value);
          }
        });
      });
    });

    return x;
  };

  setFormDtoType = (type: HrFormType) => (x: FormDto) => {
    if(!x) return x;
    x.type = type;

    return x;
  }
}