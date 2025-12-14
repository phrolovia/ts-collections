import { InvalidArgumentException } from "../../shared/InvalidArgumentException";

export const ensureSequenceArgumentValidity = (start: number, end: number, step: number) => {
    if (isNaN(start)) {
        throw new InvalidArgumentException("start cannot be NaN");
    }
    if (isNaN(end)) {
        throw new InvalidArgumentException("end cannot be NaN");
    }
    if (isNaN(step)) {
        throw new InvalidArgumentException("step cannot be NaN");
    }
    if (step > 0 && end < start) {
        throw new InvalidArgumentException("step cannot be greater than zero when end is less than start");
    }
    if (step < 0 && end > start) {
        throw new InvalidArgumentException("step cannot be less than zero when end is greater than start");
    }
    if (step === 0 && end !== start) {
        throw new InvalidArgumentException("step cannot be zero when end is not equal to start");
    }
}
