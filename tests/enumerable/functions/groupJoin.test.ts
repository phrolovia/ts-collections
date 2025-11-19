import { describe, expect, test } from "vitest";
import { empty } from "../../../src/enumerator/functions/empty";
import { forEach } from "../../../src/enumerator/functions/forEach";
import { groupJoin } from "../../../src/enumerator/functions/groupJoin";
import { orderByDescending } from "../../../src/enumerator/functions/orderByDescending";
import { single } from "../../../src/enumerator/functions/single";
import { toArray } from "../../../src/enumerator/functions/toArray";
import { toList } from "../../../src/enumerator/functions/toList";
import { where } from "../../../src/enumerator/functions/where";
import { School } from "../../models/School";
import { SchoolStudents } from "../../models/SchoolStudents";
import { Student } from "../../models/Student";
import "../../../src/enumerator/OrderedEnumerator";
import "../../../src/list/List";

describe("#groupJoin()", () => {
    const school1 = new School(1, "Elementary School");
    const school2 = new School(2, "High School");
    const school3 = new School(3, "University");
    const school4 = new School(5, "Academy");
    const desiree = new Student(100, "Desireé", "Moretti", 3);
    const apolline = new Student(200, "Apolline", "Bruyere", 2);
    const giselle = new Student(300, "Giselle", "García", 2);
    const priscilla = new Student(400, "Priscilla", "Necci", 1);
    const lucrezia = new Student(500, "Lucrezia", "Volpe", 4);
    const schools = [school1, school2, school3, school4];
    const students = [desiree, apolline, giselle, priscilla, lucrezia];
    test("should join and group by school id", () => {
        const joinedData = groupJoin(schools, students, sc => sc.id, st => st.schoolId,
            (school, students) => {
                const studentsList = students ? toList(students) : toList(empty<Student>());
                return new SchoolStudents(school.id, studentsList)
            }
        );
        const orderedJoinedData = orderByDescending(joinedData, sd => sd.students.size());
        const finalData = toArray(orderedJoinedData);
        const finalOutput: string[] = [];
        forEach(finalData, sd => {
            const school = single(where(schools, s => s.id === sd.schoolId));
            finalOutput.push(`Students of ${school.name}: `);
            forEach(sd.students, st => finalOutput.push(`[${st.id}] :: ${st.name} ${st.surname}`));
        });
        const expectedOutput: string[] = [
            "Students of High School: ",
            "[200] :: Apolline Bruyere",
            "[300] :: Giselle García",
            "Students of Elementary School: ",
            "[400] :: Priscilla Necci",
            "Students of University: ",
            "[100] :: Desireé Moretti",
            "Students of Academy: "
        ];
        expect(finalOutput).to.deep.equal(expectedOutput);
    });
});
