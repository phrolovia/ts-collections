import {IList} from "../../src/list/IList";
import {Student} from "./Student";

export class SchoolStudents {
    SchoolId: number;
    Students: IList<Student>;
    public constructor(schoolId: number, students: IList<Student>) {
        this.SchoolId = schoolId;
        this.Students = students;
    }
}
