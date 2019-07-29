export class InvalidOperationException extends Error {
    name = "InvalidOperationException";
    message = "Invalid operation."
    public constructor(message?: string) {
        super();
        if (message) this.message = message;
    }
}