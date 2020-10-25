import { Division } from '@app/models/division';

export class DivisionNode {
    public checked: boolean;
    public division: Division;
    public parent?: DivisionNode = null;
    public children: DivisionNode[] = []

    constructor(division: Division, checked: boolean = false) {
        this.division = division;
        this.checked = checked;
    }

    public toggle() {
        this.checked = !this.checked;
    }

    public check() {
        this.checked = true;
    }
    
    public clear() {
        this.checked = false;
    }

    public checkDown() {
        this.check();

        if (this.children.length > 0) {
            this.children.forEach(child => {
                child.checkDown();
            });
        }
    }

    public clearDown() {
        this.clear();

        if (this.children.length > 0) {
            this.children.forEach(child => {
                child.clearDown();
            });
        }
    }

    public checkUp() {
        this.check();

        if (this.parent)
            this.parent.checkUp();
    }

    public addChild(child: DivisionNode): void {
        child.parent = this;
        this.children.push(child);
    }

    public addMultipleChildren(children: DivisionNode[]): void {
        children.forEach(child => {
            this.addChild(child);
        });
    }

}