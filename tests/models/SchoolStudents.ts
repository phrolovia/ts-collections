import { IList } from "../../src/list/IList";
import { Student } from "./Student";

export class SchoolStudents {
    public schoolId: number;
    public students: IList<Student>;

    public constructor(schoolId: number, students: IList<Student>) {
        this.schoolId = schoolId;
        this.students = students;
    }
}
