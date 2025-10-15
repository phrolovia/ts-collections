export class InsufficientElementException extends Error {
    public constructor(param: string = "Sequence contains insufficient elements.") {
        super(param);
    }
}
