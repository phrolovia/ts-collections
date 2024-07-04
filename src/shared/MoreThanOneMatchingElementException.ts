export class MoreThanOneMatchingElementException extends Error {
    public constructor(message: string = "Sequence contains more than one matching element.") {
        super(message);
    }
}