export class ArgumentException extends Error {
    public name = "ArgumentException";
    public message = "Invalid argument."
    public constructor(message?: string) {
        super();
        if(message) {
            this.message = message;
        }
    }
}