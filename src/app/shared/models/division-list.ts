import { EventEmitter, Output } from '@angular/core';
import { Division } from '@app/models/division';
import { DivisionNode } from './division-node';

export class DivisionList {
    
    public toplevelDivisions: DivisionNode[] = [];
    public asFilter: boolean;
    @Output() checkedDivisions = new EventEmitter<DivisionNode[]>();

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

    public toggle(divNode: DivisionNode): void {
        if (divNode.checked) {
            this.clear(divNode);
        } else {
            this.check(divNode);
        }

        this.checkedDivisions.emit(this.getCheckedDivisions());
    }

    public clear(divNode: DivisionNode): void {
        divNode.clearDown();
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
            node.clearDown();
        });
    }

    public getCheckedDivisions(): DivisionNode[] {
        var checkedDivisions: DivisionNode[] = [];

        checkedDivisions = this.getCheckedOf(this.toplevelDivisions);
        
        return checkedDivisions.map(divNode => divNode);
    }

    private getCheckedOf(divNodes: DivisionNode[]): DivisionNode[] {
        var checkedDivNodes: DivisionNode[] = [];

        divNodes.forEach(node => {
            if (node.checked) {
                checkedDivNodes.push(node);
            }

            if (node.children.length > 0) {
                var childNodes = this.getCheckedOf(node.children);
                childNodes.forEach(divNode => {
                    checkedDivNodes.push(divNode);
                });
            }
        });

        return checkedDivNodes;
    }
}