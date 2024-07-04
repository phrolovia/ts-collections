export class IndexOutOfBoundsException extends Error {
    public constructor(param: string | number = "Index is out of bounds.") {
        if (typeof param === "number") {
            super(`Index ${param} is out of bounds.`);
        } else {
            super(param);
        }
    }
}