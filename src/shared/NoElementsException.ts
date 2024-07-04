export class NoElementsException extends Error {
    public constructor(message: string = "Sequence contains no elements.") {
        super(message);
    }
}