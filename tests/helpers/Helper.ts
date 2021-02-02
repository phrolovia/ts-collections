export abstract class Helper {
    public static generateRandomNumber(min: number, max: number) {
        return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
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
            var int = Math.random() * Math.pow(10, 8) << 0;
            if (!intsmap[int]) {
                intsmap[int] = true;
                numbers.push(int);
                --i;
            }
        }
        return numbers;
    }
}
