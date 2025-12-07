import { describe, expect, test } from "vitest";
import { rightJoin } from "../../../src/enumerator/functions/rightJoin";
import { List } from "../../../src/list/List";
import { School } from "../../models/School";
import { Student } from "../../models/Student";

describe("#rightJoin()", () => {
    const school1 = new School(1, "Elementary School");
    const school2 = new School(2, "High School");
    const school3 = new School(3, "University");
    const desiree = new Student(100, "Desireé", "Moretti", 3);
    const apolline = new Student(200, "Apolline", "Bruyere", 2);
    const giselle = new Student(300, "Giselle", "García", 2);
    const priscilla = new Student(400, "Priscilla", "Necci", 1);
    const lucrezia = new Student(500, "Lucrezia", "Volpe", 4);
    const schools = new List([school1, school2, school3]);
    const students = new List([desiree, apolline, giselle, priscilla, lucrezia]);

    test("includes unmatched inner elements once with null outer", () => {
        const joinedData = rightJoin(
            schools,
            students,
            s => s.id,
            st => st.schoolId,
            (school, student) => `${school?.name ?? null} :: ${student!.name} ${student!.surname}`
        ).toArray();

        expect(joinedData).to.deep.equal([
            "University :: Desireé Moretti",
            "High School :: Apolline Bruyere",
            "High School :: Giselle García",
            "Elementary School :: Priscilla Necci",
            "null :: Lucrezia Volpe"
        ]);
    });
});
