import { describe, expect, test } from "vitest";
import { leftJoin } from "../../../src/enumerator/functions/leftJoin";
import { List } from "../../../src/list/List";
import { School } from "../../models/School";
import { Student } from "../../models/Student";

describe("#leftJoin()", () => {
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

    test("includes unmatched outer elements once with null inner", () => {
        const joinedData = leftJoin(
            students,
            schools,
            st => st.schoolId,
            sc => sc.id,
            (student, school) => `${student.name} ${student.surname} :: ${school?.name ?? null}`
        ).toArray();

        expect(joinedData).to.deep.equal([
            "Desireé Moretti :: University",
            "Apolline Bruyere :: High School",
            "Giselle García :: High School",
            "Priscilla Necci :: Elementary School",
            "Lucrezia Volpe :: null"
        ]);
    });
});
