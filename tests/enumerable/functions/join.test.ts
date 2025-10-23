import { describe, expect, test } from "vitest";
import { forEach } from "../../../src/enumerator/functions/forEach";
import { join } from "../../../src/enumerator/functions/join";
import { List } from "../../../src/list/List";
import { Pair } from "../../models/Pair";
import { Person } from "../../models/Person";
import { School } from "../../models/School";
import { Student } from "../../models/Student";

describe("#join()", () => {
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
    test("should join students and schools", () => {
        const joinedData = join(students, schools, st => st.schoolId, sc => sc.id,
            (student, school) => `${student.name} ${student.surname} :: ${school?.name}`
        );
        const expectedOutputDataList = [
            "Desireé Moretti :: University",
            "Apolline Bruyere :: High School",
            "Giselle García :: High School",
            "Priscilla Necci :: Elementary School"
        ];
        expect(joinedData.toArray()).to.deep.equal(expectedOutputDataList);
    });
    test("should set null for school if left join is true", () => {
        const joinedData = join(students, schools, st => st.schoolId, sc => sc.id,
            (student, school) => [student, school],
            (stId, scId) => stId === scId,
            true
        );
        forEach(joinedData, ([st, sc]) => {
            const student = st as Student;
            const school = sc as School;
            if (student.surname === "Volpe") {
                expect(school).to.be.null;
            } else {
                expect(school).to.not.be.null;
            }
        });
    });
    test("should join key-value pairs", () => {
        const first = [new Pair(1, Person.Alice.name), new Pair(2, Person.Kaori.name), new Pair(3, Person.Mirei.name)];
        const second = [new Pair(1, Person.Alice.surname), new Pair(2, Person.Kaori.surname), new Pair(3, Person.Mirei.surname)];
        const joinedData = join(first, second, f => f.key, s => s.key, (f, s) => [f.value, s?.value]);
        const expectedOutputDataList = [
            [Person.Alice.name, Person.Alice.surname],
            [Person.Kaori.name, Person.Kaori.surname],
            [Person.Mirei.name, Person.Mirei.surname]
        ];
        expect(joinedData.toArray()).to.deep.equal(expectedOutputDataList);
    });
});
