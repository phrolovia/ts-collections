import {IEnumerable} from "./IEnumerable";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {ErrorMessages} from "../shared/ErrorMessages";
import {Predicate} from "../shared/Predicate";
import {List} from "../list/List";

export class Enumerable<TElement> implements IEnumerable<TElement> {
    private readonly enumerator: Enumerator<TElement>;

    public constructor(private readonly iterable: Iterable<TElement>) {
        this.enumerator = new Enumerator<TElement>(() => iterable);
    }

    public static from<TSource>(source: IEnumerable<TSource> | Array<TSource>) {
        return new Enumerable(source);
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.iterable[Symbol.iterator]();
    }

    public aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return this.enumerator.aggregate(accumulator, seed, resultSelector);
    }

    public all(predicate?: Predicate<TElement>): boolean {
        return this.enumerator.all(predicate);
    }

    public any(predicate?: Predicate<TElement>): boolean {
        return this.enumerator.any(predicate);
    }

    public append(element: TElement): IEnumerable<TElement> {
        return this.enumerator.append(element);
    }

    public concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement> {
        return this.enumerator.concat(enumerable);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.enumerator.contains(element, comparator);
    }

    public first(predicate?: Predicate<TElement>): TElement {
        return this.enumerator.first(predicate);
    }

    public firstOrDefault(predicate?: Predicate<TElement>): TElement {
        return this.enumerator.firstOrDefault(predicate);
    }

    public skip(count: number): IEnumerable<TElement> {
        return this.enumerator.skip(count);
    }

    public toArray(): TElement[] {
        return this.enumerator.toArray();
    }

    public toList(): List<TElement> {
        return this.enumerator.toList();
    }
}

class Enumerator<TElement> implements IEnumerable<TElement> {
    public constructor(private readonly iterable: () => Iterable<TElement>) {
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.iterable()[Symbol.iterator]();
    }

    public aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        if (!accumulator) {
            throw new Error(ErrorMessages.NoAccumulatorProvided);
        }
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            if (!this.any()) {
                throw new Error(ErrorMessages.NoElements);
            }
            accumulatedValue = this.first() as unknown as TAccumulate;
            for (const element of this.skip(1)) {
                accumulatedValue = accumulator(accumulatedValue, element);
            }
        } else {
            accumulatedValue = seed;
            for (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
            }
        }
        if (resultSelector) {
            return resultSelector(accumulatedValue);
        } else {
            return accumulatedValue;
        }
    }

    public all(predicate?: Predicate<TElement>): boolean {
        if (!predicate) {
            return !this[Symbol.iterator]().next().done;
        }
        for (const d of this) {
            if (!predicate(d)) {
                return false;
            }
        }
        return true;
    }

    public any(predicate?: Predicate<TElement>): boolean {
        if (!predicate) {
            return !this[Symbol.iterator]().next().done;
        }
        for (const element of this) {
            if (predicate(element)) {
                return true;
            }
        }
        return false;
    }

    public append(element: TElement): IEnumerable<TElement> {
        return new Enumerator(() => this.appendGenerator(element));
    }

    public concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement> {
        return new Enumerator(() => this.concatGenerator(enumerable));
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        for (const e of this) {
            if (comparator(e, element)) {
                return true;
            }
        }
        return false;
    }

    public first(predicate?: Predicate<TElement>): TElement {
        if (!this.any()) {
            throw new Error(ErrorMessages.NoElements);
        }
        const item = this.firstOrDefault(predicate);
        if (!item) {
            throw new Error(ErrorMessages.NoMatchingElement);
        }
        return item;
    }

    public firstOrDefault(predicate?: Predicate<TElement>): TElement {
        if (!predicate) {
            return this[Symbol.iterator]().next().value ?? null;
        } else {
            let first: TElement = null;
            for (const item of this) {
                if (predicate(item)) {
                    first = item;
                    break;
                }
            }
            return first;
        }
    }

    public skip(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.skipGenerator(count));
    }

    public toArray(): TElement[] {
        const array: TElement[] = [];
        for (const element of this) {
            array.push(element);
        }
        return array;
    }

    public toList(): List<TElement> {
        return List.from(this);
    }

    private* appendGenerator(element: TElement): Iterable<TElement> {
        yield* this.iterable();
        yield element;
    }

    private* concatGenerator(enumerable: IEnumerable<TElement>): Iterable<TElement> {
        yield* this.iterable();
        yield* enumerable;
    }

    private* skipGenerator(count: number): Iterable<TElement> {
        let index = 0;
        for (const item of this) {
            if (index >= count) {
                yield item;
            }
            ++index;
        }
    }
}
