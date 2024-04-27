import {
    AbstractEnumerable,
    ICollectionChangedEventArgs,
    IReadonlyCollection,
    ObservableCollection
} from "../imports.ts";
import { EqualityComparator } from "../shared/EqualityComparator";

export class ReadonlyObservableCollection<TElement> extends AbstractEnumerable<TElement> implements IReadonlyCollection<TElement> {
    readonly #collection: ObservableCollection<TElement>;
    collectionChanged?: (sender: this, args: ICollectionChangedEventArgs<TElement>) => void;

    public constructor(collection: ObservableCollection<TElement>) {
        super(collection.comparator);
        this.#collection = collection;
        this.setCollectionChangedEvent();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#collection;
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.#collection.contains(element, comparator);
    }

    public containsAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        return this.#collection.containsAll(collection);
    }

    public get(index: number): TElement {
        return this.#collection.get(index);
    }

    public isEmpty(): boolean {
        return this.#collection.isEmpty();
    }

    public size(): number {
        return this.#collection.size();
    }

    public get comparator(): EqualityComparator<TElement> {
        return this.#collection.comparator;
    }

    public get length(): number {
        return this.#collection.length;
    }

    private setCollectionChangedEvent(): void {
        this.#collection.collectionChanged = (sender, args) => {
            this.collectionChanged?.(this, args);
        }
    }
}