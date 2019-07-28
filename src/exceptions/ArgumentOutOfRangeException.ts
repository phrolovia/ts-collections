export class ArgumentOutOfRangeException extends Error {
    public name: string = "ArgumentOutOfRangeException";
    public message: string = "arrayIndex is out of range.";
    public constructor(message: string) {
        super();
        this.message = message;
    }
}