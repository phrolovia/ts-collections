export abstract class Helper {
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
