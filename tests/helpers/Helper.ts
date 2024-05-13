import { Person } from "../models/Person";

export abstract class Helper {
    public static generateRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (1 + max - min)) + min;
    }

    public static generateRandomString(length: number): string {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static generateRandomUniqueNumbers(count: number): number[] {
        const intsmap: { [key: number]: boolean } = {};
        let i = count;
        const numbers: number[] = [];
        while (i > 0) {
            const int = Math.random() * Math.pow(10, 8) << 0;
            if (!intsmap[int]) {
                intsmap[int] = true;
                numbers.push(int);
                --i;
            }
        }
        return numbers;
    }

    public static generateRandomPerson(count: number): Person[] {
        const people: Person[] = [];
        for (let px = 0; px < count; ++px) {
            const person = new Person(this.generateRandomString(10), this.generateRandomString(15), this.generateRandomNumber(1, 100));
            people.push(person);
        }
        return people;
    }
}
