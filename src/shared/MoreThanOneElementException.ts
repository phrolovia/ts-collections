export class MoreThanOneElementException extends Error {
    public constructor(message: string = "Sequence contains more than one element.") {
        super(message);
    }
}