import { describe, expect, test } from "vitest";
import { selectMany } from "../../../src/enumerator/functions/selectMany";
import { Person } from "../../models/Person";

describe("#selectMany()", () => {
    Person.Viola.friendsArray = [Person.Rebecca];
    Person.Jisu.friendsArray = [Person.Alice, Person.Mel];
    Person.Vanessa.friendsArray = [Person.Viola, Person.Rebecca, Person.Jisu, Person.Alice];
    Person.Rebecca.friendsArray = [Person.Viola];
    const people = [Person.Viola, Person.Rebecca, Person.Jisu, Person.Vanessa];
    const friendAges = selectMany(people, p => p.friendsArray).select(p => p.age).toArray();
    test("should return an array of friend ages", () => {
        expect(friendAges).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
    });
});
