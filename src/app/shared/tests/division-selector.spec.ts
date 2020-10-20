import { async } from "@angular/core/testing";
import { Division } from '@app/models/division';

describe("DivisionSelector", () => {
  describe("Division Selector checking", () => {
      var divisionNode: DivisionNode;
    beforeEach(async(() => {
        divisionNode = {
            division: new Division(),
            parent: DivisionNode,
            checked: false,
        }
    }));

    it("should initialize divisionNode", () => {
      expect(divisionNode).toBeTruthy();
    });

  });
});
