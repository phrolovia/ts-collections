import type { PercentileStrategy } from "../../shared/PercentileStrategy";
import { nthElement } from "./medianHelpers";

export function findPercentile(data: number[], percent: number, strategy: PercentileStrategy = "linear"): number {
    if (data.length === 0) {
        return Number.NaN;
    }
    if (data.length === 1) {
        return data[0];
    }
    if (percent <= 0) {
        return nthElement(data, 0);
    }
    if (percent >= 1) {
        return nthElement(data, data.length - 1);
    }
    const exactIndex = (data.length - 1) * percent;

    switch (strategy) {
        case "nearest": {
            const k = Math.round(exactIndex);
            return nthElement(data, k);
        }
        case "low": {
            const k = Math.floor(exactIndex);
            return nthElement(data, k);
        }
        case "high": {
            const k = Math.ceil(exactIndex);
            return nthElement(data, k);
        }
        case "midpoint": {
            const low = Math.floor(exactIndex);
            const high = Math.ceil(exactIndex);
            const valueLow = nthElement(data, low);
            const valueHigh = nthElement(data, high);
            return (valueLow + valueHigh) / 2;
        }
        case "linear":
        default: {
            const low = Math.floor(exactIndex);
            const high = low + 1;
            if (high >= data.length) {
                return nthElement(data, low);
            }
            const valueLow = nthElement(data, low);
            const valueHigh = nthElement(data, high);
            const fraction = exactIndex - low;
            return valueLow + fraction * (valueHigh - valueLow);
        }
    }
}
