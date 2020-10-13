import {Student} from "./Student";
import {IList} from "../../src/list/IList";

export class SchoolStudents {
    public schoolId: number;
    public students: IList<Student>;
    public constructor(schoolId: number, students: IList<Student>) {
        this.schoolId = schoolId;
        this.students = students;
    }
}
