import { DivisionNode } from './division-node';

export class DivisionList {
    
    public toplevelDivisions: DivisionNode[] = [];
    public asFilter: boolean = true;

    constructor() {
        
    }

    public updateToplevelDivisions(divisionNodes: DivisionNode[]): void {
        this.toplevelDivisions = divisionNodes;
    }

    public clear(): void {
        this.toplevelDivisions.forEach(node => {
            this.clearNode(node);
        });
    }

    private clearNode(node: DivisionNode): void {
        node.checked = false;
        if (node.countChildren() > 0)
            if (node.leftmostChild != null)
                this.clearNode(node.leftmostChild);
    }
}