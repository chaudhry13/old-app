import { Division } from '@app/models/division';
import { DivisionNode } from '@shared/models/division-node';

export module TestHelper {
    export function generateDivisionNode(divisionName: string): DivisionNode {
        var division = new Division();
        division.name = divisionName;
        
        return new DivisionNode(division);
    }
}