export class NoMatchingElementException extends Error {
    public constructor(message: string = "Sequence contains no matching element.") {
        super(message);
    }
}