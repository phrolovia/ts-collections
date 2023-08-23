export class Student {
    public id: number;
    public name: string;
    public surname: string;
    public schoolId: number;
    public constructor(id: number, name: string, surname: string, schoolId: number) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.schoolId = schoolId;
    }
}
