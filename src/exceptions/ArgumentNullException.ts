export class ArgumentNullException extends Error {
    name = "ArgumentNullException";
    message = "object is null."
    public constructor(message?: string) {
        super();
        if (message) this.message = message;
    }
}