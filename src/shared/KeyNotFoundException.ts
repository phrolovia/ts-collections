export class KeyNotFoundException extends Error {
    public constructor(key: string) {
        super(`Key could not be found: ${key}`);
    }
}