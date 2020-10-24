import { async } from "@angular/core/testing";
import { Division } from '@app/models/division';
import { DivisionListComponent } from '@shared/components/division-list/division-list.component';
import { DivisionList } from '@shared/models/division-list';
import { DivisionNode } from '@shared/models/division-node';

describe("DivisionNode", () => {
    var divNode: DivisionNode;
    var childDivision: Division;
    var parentDivision: Division;
    describe("DivisionNode data", () => {
        
        beforeEach(async(() => {
            childDivision = new Division();
            parentDivision = new Division();
            divNode = new DivisionNode(childDivision)
        }));

        it("should initialize divisionNode with not checked", () => {
            expect(divNode).toBeTruthy();
            expect(divNode.checked).toBeFalsy();
        });

        it("should always have division", () => {
            expect(divNode.division).toBeTruthy();
        });

        it("should be able to check it self", () => {
            divNode.check();
            expect(divNode.checked).toBeTruthy();
        });

        it("should initially have null parent", () => {
            expect(divNode.parent).toBeNull();
        });

        it("should be able to have parent", () => {
            divNode.parent = new DivisionNode(parentDivision);

            expect(divNode.parent).toBeTruthy();
        });

        it("should be able to add child and set parent on child", () => {
            var parentDivNode = new DivisionNode(parentDivision);

            parentDivNode = parentDivNode.addChild(divNode);

            console.log(parentDivNode);

            expect(divNode.parent).toBeTruthy();
            expect(parentDivNode.countChildren()).toBe(1);
        });
    });
});

describe("DivisionList", () => {

    describe("DivisionList Data",  () => {
        var divisionList = new DivisionList();
        var divNode1 = new DivisionNode(new Division);
        var divNode2 = new DivisionNode(new Division);
        var divNode3 = new DivisionNode(new Division);
    
        beforeEach(async(() => {
            divisionList.updateToplevelDivisions([divNode1, divNode2, divNode3])
        }));
    
        it("should contain an array of top level divisions", () => {
            expect(divisionList.toplevelDivisions).toBeTruthy()
            expect(divisionList.toplevelDivisions.length).toBe(3);
        });
    
        it("should respect hierarchy in divisions", () => {
            divNode1.addMultipleChildren([divNode2, divNode3]);
    
            divisionList.updateToplevelDivisions([divNode1]);
    
            expect(divNode1.countChildren()).toBe(2);
            expect(divisionList.toplevelDivisions.length).toBe(1);
        });
    });

    describe("DivisionList behaviour", () => {
        var divisionList = new DivisionList();
        var divNode1 = new DivisionNode(new Division, true);
        var divNode2 = new DivisionNode(new Division, true);
        var divNode3 = new DivisionNode(new Division, true);
        var divNode4 = new DivisionNode(new Division, true);
    
        beforeEach(() => {
            divNode1.addMultipleChildren([divNode2, divNode3]);
            divNode2.addChild(divNode4);
            divisionList.updateToplevelDivisions([divNode1]);
        });

        it("should be able to clear all checks", () => {
            expect(divNode1.checked).toBeTruthy();
            expect(divNode2.checked).toBeTruthy();
            expect(divNode3.checked).toBeTruthy();
            expect(divNode4.checked).toBeTruthy();

            divisionList.clear();

            expect(divNode1.checked).toBeFalsy();
            expect(divNode2.checked).toBeFalsy();
            expect(divNode3.checked).toBeFalsy();
            expect(divNode4.checked).toBeFalsy();
        });

        it("should check parent of all children is checked", () => {
            divisionList.asFilter = true;
            divNode1.checked = false;
            divNode2.checked = false;
            divNode3.checked = false;
            divNode4.checked = false;

            divNode4.check();

            expect(divNode2.checked).toBeTruthy();
        });
    });


})
