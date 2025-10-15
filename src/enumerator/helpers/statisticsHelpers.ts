import { Selector } from "../../shared/Selector";
import { InsufficientElementException } from "../../shared/InsufficientElementException";

const defaultNumberSelector = (value: unknown): number => value as number;

export const resolveNumberSelector = <T>(selector?: Selector<T, number>): Selector<T, number> => {
    return selector ?? (defaultNumberSelector as Selector<T, number>);
};

interface PairStats {
    count: number;
    sumSqX: number;
    sumSqY: number;
    sumSqXY: number;
}

interface SingleStats {
    count: number;
    sumSq: number;
}

interface PairStatsAccumulator {
    readonly stats: PairStats;
    add(x: number, y: number): void;
}

interface SingleStatsAccumulator {
    readonly stats: SingleStats;
    add(value: number): void;
}

const createPairStatsAccumulator = (): PairStatsAccumulator => {
    const stats: PairStats = {
        count: 0,
        sumSqX: 0,
        sumSqY: 0,
        sumSqXY: 0
    };

    let meanX = 0;
    let meanY = 0;

    return {
        stats,
        add(x: number, y: number): void {
            stats.count += 1;

            const deltaX = x - meanX;
            meanX += deltaX / stats.count;
            const deltaY = y - meanY;
            meanY += deltaY / stats.count;

            stats.sumSqX += deltaX * (x - meanX);
            stats.sumSqY += deltaY * (y - meanY);
            stats.sumSqXY += deltaX * (y - meanY);
        }
    };
};

const createSingleStatsAccumulator = (): SingleStatsAccumulator => {
    const stats: SingleStats = {
        count: 0,
        sumSq: 0
    };
    let mean = 0;

    return {
        stats,
        add(value: number): void {
            stats.count += 1;
            const delta = value - mean;
            mean += delta / stats.count;
            stats.sumSq += delta * (value - mean);
        }
    };
};

export const accumulatePairStatsFromIterables = <TLeft, TRight>(
    left: Iterable<TLeft>,
    right: Iterable<TRight>,
    leftSelector: Selector<TLeft, number>,
    rightSelector: Selector<TRight, number>,
    dimensionMismatchError: Error
): PairStats => {
    const leftIterator = left[Symbol.iterator]();
    const rightIterator = right[Symbol.iterator]();
    const accumulator = createPairStatsAccumulator();

    while (true) {
        const nextLeft = leftIterator.next();
        const nextRight = rightIterator.next();

        if (nextLeft.done && nextRight.done) {
            break;
        }

        if (nextLeft.done !== nextRight.done) {
            throw dimensionMismatchError;
        }
        accumulator.add(leftSelector(nextLeft.value), rightSelector(nextRight.value));
    }
    return accumulator.stats;
};

export const accumulatePairStatsFromSingleIterable = <T>(
    iterable: Iterable<T>,
    leftSelector: Selector<T, number>,
    rightSelector: Selector<T, number>
): PairStats => {
    const accumulator = createPairStatsAccumulator();
    for (const item of iterable) {
        accumulator.add(leftSelector(item), rightSelector(item));
    }
    return accumulator.stats;
};

export const accumulateSingleStats = <T>(
    iterable: Iterable<T>,
    selector: Selector<T, number>
): SingleStats => {
    const accumulator = createSingleStatsAccumulator();
    for (const item of iterable) {
        accumulator.add(selector(item));
    }
    return accumulator.stats;
};

export const accumulatePairStatsFromAsyncIterables = async <TLeft, TRight>(
    left: AsyncIterable<TLeft>,
    right: AsyncIterable<TRight>,
    leftSelector: Selector<TLeft, number>,
    rightSelector: Selector<TRight, number>,
    dimensionMismatchError: Error
): Promise<PairStats> => {
    const leftIterator = left[Symbol.asyncIterator]();
    const rightIterator = right[Symbol.asyncIterator]();
    const accumulator = createPairStatsAccumulator();

    while (true) {
        const [nextLeft, nextRight] = await Promise.all([leftIterator.next(), rightIterator.next()]);

        if (nextLeft.done && nextRight.done) {
            break;
        }
        if (nextLeft.done !== nextRight.done) {
            throw dimensionMismatchError;
        }
        accumulator.add(leftSelector(nextLeft.value), rightSelector(nextRight.value));
    }
    return accumulator.stats;
};

export const accumulatePairStatsFromSingleAsyncIterable = async <T>(
    iterable: AsyncIterable<T>,
    leftSelector: Selector<T, number>,
    rightSelector: Selector<T, number>
): Promise<PairStats> => {
    const accumulator = createPairStatsAccumulator();
    for await (const item of iterable) {
        accumulator.add(leftSelector(item), rightSelector(item));
    }
    return accumulator.stats;
};

export const accumulateSingleStatsAsync = async <T>(
    iterable: AsyncIterable<T>,
    selector: Selector<T, number>
): Promise<SingleStats> => {
    const accumulator = createSingleStatsAccumulator();

    for await (const item of iterable) {
        accumulator.add(selector(item));
    }

    return accumulator.stats;
};

export const findCorrelation = (stats: PairStats): number => {
    if (stats.count < 2) {
        throw new InsufficientElementException("Correlation requires at least two pairs of elements.");
    }
    const sumSqX = Math.max(stats.sumSqX, 0);
    const sumSqY = Math.max(stats.sumSqY, 0);
    const denominator = Math.sqrt(sumSqX * sumSqY);
    if (denominator === 0) {
        throw new Error("Correlation is undefined when the standard deviation of either variable is zero.");
    }
    return stats.sumSqXY / denominator;
}
