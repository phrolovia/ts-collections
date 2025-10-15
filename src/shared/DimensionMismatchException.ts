export class DimensionMismatchException extends Error {
    public constructor(param: string = "Dimensions do not match.") {
        super(param);
    }
}
