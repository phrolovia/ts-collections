import { AbstractEnumerable } from "../enumerator/AbstractEnumerable";
import type { IList } from "../list/IList";
import { List } from "../list/List";
import { ReadonlyList } from "../list/ReadonlyList";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { CollectionChangedAction, type ICollectionChangedEventArgs } from "./ICollectionChangedEventArgs";

export class ObservableCollection<TElement> extends AbstractEnumerable<TElement> {
    readonly #list: IList<TElement>;
    public collectionChanged?: (sender: this, args: ICollectionChangedEventArgs<TElement>) => void;

    public constructor();
    public constructor(iterable?: Iterable<TElement>);
    public constructor(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>);
    public constructor(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#list = new List(iterable ?? [], comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#list;
    }

    public add(element: TElement): boolean {
        this.#list.add(element);
        this.collectionChanged?.(this, {
            newItems: new ReadonlyList(new List([element])),
            oldItems: new ReadonlyList(new List()),
            action: CollectionChangedAction.Add
        });
        return true;
    }

    public clear(): void {
        const oldItems = new ReadonlyList(new List(this.#list.toArray()));
        this.#list.clear();
        this.collectionChanged?.(this, {
                oldItems,
                newItems: new ReadonlyList(new List()),
                action: CollectionChangedAction.Reset
            }
        );
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparer;
        return this.#list.contains(element, comparator);
    }

    public containsAll<TSource extends TElement>(iterable: Iterable<TSource>): boolean {
        for (const element of iterable) {
            let found = false;
            for (const thisElement of this) {
                found ||= this.comparer(element, thisElement);
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    public get(index: number): TElement {
        return this.#list.get(index);
    }

    public insert(index: number, element: TElement): void {
        this.#list.addAt(element, index);
        this.collectionChanged?.(this, {
            newItems: new ReadonlyList(new List([element])),
            oldItems: new ReadonlyList(new List()),
            action: CollectionChangedAction.Add
        });
    }

    public isEmpty(): boolean {
        return this.#list.isEmpty();
    }

    public move(oldIndex: number, newIndex: number): void {
        const element = this.#list.removeAt(oldIndex);
        this.#list.addAt(element, newIndex);
        this.collectionChanged?.(this, {
            newItems: new ReadonlyList(new List([element])),
            oldItems: new ReadonlyList(new List([element])),
            action: CollectionChangedAction.Move
        });
    }

    public remove(element: TElement): boolean {
        if (this.#list.remove(element)) {
            this.collectionChanged?.(this, {
                oldItems: new ReadonlyList(new List([element])),
                newItems: new ReadonlyList(new List()),
                action: CollectionChangedAction.Remove
            });
            return true;
        }
        return false;
    }

    public removeAt(index: number): TElement {
        const element = this.#list.removeAt(index);
        this.collectionChanged?.(this, {
            oldItems: new ReadonlyList(new List([element])),
            newItems: new ReadonlyList(new List()),
            action: CollectionChangedAction.Remove
        });
        return element;
    }

    public set(index: number, element: TElement) {
        const oldElement = this.#list.get(index);
        this.#list.set(index, element);
        this.collectionChanged?.(this, {
            oldItems: new ReadonlyList(new List([oldElement])),
            newItems: new ReadonlyList(new List([element])),
            action: CollectionChangedAction.Replace
        });
    }

    public size(): number {
        return this.#list.size();
    }

    public get comparator(): EqualityComparator<TElement> {
        return this.#list.comparator as EqualityComparator<TElement>;
    }

    public get length(): number {
        return this.#list.length;
    }
}
