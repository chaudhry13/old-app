import { Division } from '@app/models/division';
import { User } from '@app/models/user';
import { DivisionNode } from '@shared/models/division-node';

export module TestHelper {
    export function generateDivisionNode(divisionName: string): DivisionNode {
        var division = new Division();
        division.name = divisionName;
        
        return new DivisionNode(division);
    }

    export function generateDummyDivisions(): Division[] {
        return [
            {
                id: "test1",
                name: "div1",
                children: [
                    {
                        id: "test1.1",
                        name: "div1.1",
                        created: new Date(),
                        user: new User(),
                        individualDivision: false,
                        children: []
                    },
                    {
                        id: "test1.2",
                        name: "div1.2",
                        created: new Date(),
                        user: new User(),
                        individualDivision: false,
                        children: []
                    }
                ],
                created: new Date(),
                user: new User(),
                individualDivision: false
            },
            {
                id: "test2",
                name: "div2",
                children: [
                    {
                        id: "test2.1",
                        name: "div2.1",
                        created: new Date(),
                        user: new User(),
                        individualDivision: false,
                        children: []
                    },
                    {
                        id: "test2.2",
                        name: "div2.2",
                        created: new Date(),
                        user: new User(),
                        individualDivision: false,
                        children: []
                    }
                ],
                created: new Date(),
                user: new User(),
                individualDivision: false
            },
            {
                id: "test3",
                name: "div3",
                created: new Date(),
                user: new User(),
                individualDivision: false,
                children: []
            }
        ];
    }
}