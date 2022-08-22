import {LogicHelperService} from "../services/logic-helper.service";
import {BuildingComponentUnion} from "../models/building-components/building-component";
import {DisplayLogic} from "../models/form-logic";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'evalLogic',
})
export class EvalLogicPipe implements PipeTransform {
    constructor(private helper: LogicHelperService) {}

    transform(bc: BuildingComponentUnion, allBc: BuildingComponentUnion[]): boolean {
        const displayLogic: DisplayLogic[] = bc.displayLogic;

        return displayLogic?.reduce((acc, curr) => {
            const currentEvaluatedLogic = allBc.find(x => x?.id === curr.selectedField);

            if (!currentEvaluatedLogic) return true && acc;
            const currEvaluatedLogicDom = document.getElementById(currentEvaluatedLogic.id);
            if(!currEvaluatedLogicDom) return false;
            if(currEvaluatedLogicDom.classList.contains('hidden')) return false;
            const logicSolver = this.helper.logicSolverFactory(currentEvaluatedLogic.type);

            return logicSolver(curr, currentEvaluatedLogic) && acc;
        }, true);
    }
}
