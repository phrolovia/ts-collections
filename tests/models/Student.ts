export class Student {
    Id: number;
    Name: string;
    Surname: string;
    SchoolId: number;
    public constructor(id: number, name: string, surname: string, schoolId?: number) {
        this.Id = id;
        this.Name = name;
        this.Surname = surname;
        this.SchoolId = schoolId;
    }
}
