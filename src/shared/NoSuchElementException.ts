export class NoSuchElementException extends Error {
    public constructor(message: string = "No such element exists in the sequence") {
        super(message);
    }
}
