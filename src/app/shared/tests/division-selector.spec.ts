import { AssertNotNull } from '@angular/compiler';
import { async } from '@angular/core/testing';
import { Division } from '@app/models/division';
import { User } from '@app/models/user';
import { DivisionList } from '@shared/models/division-list';
import { DivisionNode } from '@shared/models/division-node';
import { TestHelper } from "./test-helper";

describe("Division Selector tests", () => {
    var child: DivisionNode, child2: DivisionNode, parent: DivisionNode;

    beforeEach(async(() => {
        child = TestHelper.generateDivisionNode("child");
        child2 = TestHelper.generateDivisionNode("child2");
        parent = TestHelper.generateDivisionNode("parent");
    }));

    describe("DivisionNode", () => {
        it("should initialize divisionNode with checked as false", () => {
            expect(child).toBeTruthy();
            expect(child.checked).toBeFalsy();
        });
    
        it("should have division", () => {
            expect(child.division).toBeTruthy();
            expect(child.division.name).toBe("child");
        });
    
        it("should be able to check it self", () => {
            child.toggle();
            expect(child.checked).toBeTruthy();
        });
    
        it("should initially have null parent", () => {
            expect(child.parent).toBeNull();
        });
    
        it("should be able to add a child", () => {
            parent.addChild(child);
    
            expect(parent.children.length).toBe(1);
            expect(child.parent).toBe(parent);
        });
    });

    describe("DivisionList", () => {

        var divisionList: DivisionList;

        beforeEach(async(() => {
            divisionList = new DivisionList();
            divisionList.updateToplevelDivisions([child, child2]);
        }));

        it("should contain a list of DivisionNodes", () => {
            expect(divisionList.toplevelDivisions.length).toBe(2);
        });

        it("should be able to clear all DivisionNodes", () => {
            child.addChild(child2);
            parent.addChild(child);

            parent.check();
            child.check()
            child2.check();

            divisionList.updateToplevelDivisions([parent]);

            divisionList.clearAll();

            expect(child.checked).toBeFalsy();
            expect(child2.checked).toBeFalsy();
            expect(parent.checked).toBeFalsy();
        });

        it("should return the checked divisions", () => {
            child.check()
            child2.check();

            expect(divisionList.getCheckedDivisions()).toEqual([child, child2]);
        });

        it("should check children if parent is checked if asFilter is true", () => {
            divisionList.asFilter = true;
            
            parent.addMultipleChildren([child, child2]);

            divisionList.updateToplevelDivisions([parent]);

            divisionList.check(parent);

            expect(parent.checked).toBeTruthy();
            expect(child.checked).toBeTruthy();
            expect(child2.checked).toBeTruthy();
        });

        it("should check parents if asFilter is false", () => {
            divisionList.asFilter = false;
            
            parent.addMultipleChildren([child, child2]);

            divisionList.updateToplevelDivisions([parent]);

            divisionList.check(child);

            expect(parent.checked).toBeTruthy();
            expect(child.checked).toBeTruthy();
            expect(child2.checked).toBeFalsy();
        });

        it("should clear down (children) if asFilter is true", () => {
            divisionList.asFilter = true;
            
            parent.addMultipleChildren([child, child2]);

            divisionList.updateToplevelDivisions([parent]);


            divisionList.clear(child);
            divisionList.clear(parent);

            expect(parent.checked).toBeFalsy();
            expect(child.checked).toBeFalsy();
            expect(child2.checked).toBeFalsy();
        });

        it("should clear down if asFilter is false", () => {
            parent.addMultipleChildren([child, child2]);

            divisionList.asFilter = false;

            divisionList.check(child);
            divisionList.clear(parent);

            expect(parent.checked).toBeFalsy();
            expect(child.checked).toBeFalsy();
            expect(child2.checked).toBeFalsy();
        });

        it("should convert toplevel divisions to divisionNodes", () => {
            divisionList.toplevelDivisions = [];

            var divisions = TestHelper.generateDummyDivisions();

            divisionList.makeDivisionNodes(divisions);

            expect(divisionList.toplevelDivisions.length).toBe(3);
            expect(divisionList.toplevelDivisions[0].children[0].division.name).toBe("div1.1");
        });
    });
});


