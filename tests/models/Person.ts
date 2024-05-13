import { IList } from "../../src/list/IList";
import { List } from "../../src/list/List";

export class Person {
    public age: number;
    public name: string;
    public surname: string;
    public friendsArray: Array<Person> = [];
    public friendsList: IList<Person> = new List();

    public constructor(name: string, surname: string, age: number) {
        this.age = age;
        this.name = name;
        this.surname = surname;
    }

    public equals(other: Person): boolean {
        return this.name === other.name && this.surname === other.surname && this.age === other.age;
    }

    public isSameAge(other: Person): boolean {
        return this.age === other.age;
    }

    public toString(): string {
        return `${this.name} ${this.surname}`;
    }

    public static readonly Alice = new Person("Alice", "Rivermist", 23);
    public static readonly Amy = new Person("Amy", "Rivera", 32);
    public static readonly Bella = new Person("Bella", "Rivera", 21);
    public static readonly Eliza = new Person("Eliza", "Jackson", 19);
    public static readonly Emily = new Person("Emily", "Redridge", 25);
    public static readonly Hanna = new Person("Hanna", "Jackson", 20);
    public static readonly Hanna2 = new Person("Hanna", "Jackson", 19);
    public static readonly Hanyuu = new Person("Hanyuu", "Suzuhane", 22);
    public static readonly Jane: Person = new Person("Jane", "Green", 16);
    public static readonly Jisu = new Person("Jisu", "", 14);
    public static readonly Julia = new Person("Julia", "Watson", 44);
    public static readonly Kaori = new Person("Kaori", "Furuya", 10);
    public static readonly Lenka: Person = new Person("Lenka", "Polakova", 16);
    public static readonly Lucrezia = new Person("Lucrezia", "Volpe", 21);
    public static readonly Megan = new Person("Megan", "Watson", 44);
    public static readonly Mel: Person = new Person("Mel", "Bluesky", 9);
    public static readonly Mirei: Person = new Person("Mirei", "Kurokawa", 22);
    public static readonly Noemi = new Person("Noemi", "Waterfox", 29);
    public static readonly Noemi2 = new Person("Noemi", "Waterfox", 43);
    public static readonly Olga = new Person("Olga", "Byakova", 77);
    public static readonly Priscilla = new Person("Priscilla", "Necci", 9);
    public static readonly Rebecca = new Person("Rebecca", "Ringale", 17);
    public static readonly Reika = new Person("Reika", "Kurohana", 37);
    public static readonly Reina = new Person("Reina", "Karuizawa", 23);
    public static readonly Senna: Person = new Person("Senna", "Hikaru", 10);
    public static readonly Suzuha = new Person("Suzuha", "Suzuki", 22);
    public static readonly Suzuha2 = new Person("Suzuha", "Mizuki", 22);
    public static readonly Suzuha3 = new Person("Suzuha", "Mizuki", 26);
    public static readonly Vanessa = new Person("Vanessa", "Bloodboil", 20);
    public static readonly Viola = new Person("Viola", "Ringale", 28);
}
