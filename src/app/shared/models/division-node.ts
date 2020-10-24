import { Division } from '@app/models/division';

export class DivisionNode {
    public checked: boolean;
    public division: Division;
    public parent: DivisionNode = null;
    public leftmostChild: DivisionNode = null;
    public rightSibling: DivisionNode = null;
    public leftmostSibling: DivisionNode = null

    constructor(division: Division, checked: boolean = false) {
        this.division = division;
        this.checked = checked;
        this.leftmostSibling = this;
    }

    public check() {
        this.checked = true;
    }

    public addChild(child: DivisionNode): DivisionNode {
        if (this.leftmostChild != null) {
            this.leftmostChild = this.leftmostChild.makeSiblings(child);
        } else {
            var ysib = child.leftmostSibling;
            this.leftmostChild = ysib;
            while (ysib != null) {
                ysib.parent = this;
                ysib = ysib.rightSibling;
            }
        }

        return this;
    }

    public countChildren(): number {
        // var count = 0;
        // var child = this.leftmostChild;
        // console.log(child);
        // while (child != null) {
        //     count++;
        //     child = child.rightSibling;
        // }

        return 1;
    }

    public makeSiblings(node: DivisionNode): DivisionNode {
        var rightSibling = this.rightSibling;

        if (rightSibling == null) {
            rightSibling = this;
        } else {
            while (rightSibling != null) {
                rightSibling = rightSibling.rightSibling
            }
        }

        var nodeSiblings = node.leftmostSibling;

        rightSibling.rightSibling = nodeSiblings;

        nodeSiblings.leftmostSibling = rightSibling.leftmostSibling;

        nodeSiblings.parent = rightSibling.parent;

        while (nodeSiblings.rightSibling != null) {
            nodeSiblings = nodeSiblings.rightSibling;
            nodeSiblings.leftmostSibling = rightSibling.leftmostSibling;
            nodeSiblings.parent = rightSibling.parent;
        }

        return nodeSiblings;
    }

    public addMultipleChildren(children: DivisionNode[]): void {
        children.forEach(child => {
            this.addChild(child);
        });
    }

}