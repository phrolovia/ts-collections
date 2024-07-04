export class InvalidArgumentException extends Error {
    public constructor(message: string, argument?: string) {
        if (argument) {
            message = `Invalid argument: ${argument}. ${message}`;
            super(message);
        } else {
            super(message);
        }
    }
}