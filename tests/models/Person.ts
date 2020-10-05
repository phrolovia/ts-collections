import {IList} from "../../src/list/IList";
import {List} from "../../src/list/List";

export class Person {
    Name: string;
    Surname: string;
    Age: number;
    FriendsArray: Person[] = [];
    FriendsList: IList<Person> = new List();
    constructor(name: string, surname: string, age: number) {
        this.Name = name;
        this.Surname = surname;
        this.Age = age;
    }
    public equals(other: Person): boolean {
        return this.Name === other.Name && this.Surname === other.Surname && this.Age === other.Age;
    }
}
