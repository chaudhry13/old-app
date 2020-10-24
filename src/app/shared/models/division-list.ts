import { Division } from '@app/models/division';
import { DivisionNode } from './division-node';

export class DivisionList {
    
    public toplevelDivisions: DivisionNode[] = [];
    public asFilter: boolean = true;

    constructor() {
        
    }

    public makeDivisionNodes(divisions: Division[]) {
        var divisionNodes: DivisionNode[] = [];
        divisions.forEach(division => {
            var divNode = this.makeDivisionNode(division);
            divisionNodes.push(divNode);
        });

        this.updateToplevelDivisions(divisionNodes);
    }

    private makeDivisionNode(division: Division): DivisionNode {
        var divNode = new DivisionNode(division)
        if (division.children.length > 0) {
            division.children.forEach(child => {
                divNode.addChild(this.makeDivisionNode(child));
            });
        }

        return divNode;
    }

    public updateToplevelDivisions(divisionNodes: DivisionNode[]): void {
        this.toplevelDivisions = divisionNodes;
    }

    public clear(divNode: DivisionNode): void {
        if (this.asFilter) {
            divNode.clearDown();
        } else {
            divNode.clear();
        }
    }

    public check(divNode: DivisionNode): void {
        if (this.asFilter) {
            divNode.checkDown();
        } else {
            divNode.checkUp();
        }
    }


    public clearAll(): void {
        this.toplevelDivisions.forEach(node => {
            node.checked = false;
        });
    }

    public getCheckedDivisions(): Division[] {
        var checkedDivisions: Division[] = [];
        this.toplevelDivisions.forEach(node => {
            if (node.checked) {
                checkedDivisions.push(node.division);
            }
        });

        return checkedDivisions;
    }
}