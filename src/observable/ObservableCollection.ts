import {IObservableCollection} from "./IObservableCollection";
import {CollectionChangedAction, ICollectionChangedEventArgs} from "./ICollectionChangedEventArgs";
import {AbstractEnumerable, IList, List, ReadonlyList} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";

export class ObservableCollection<TElement> extends AbstractEnumerable<TElement> implements IObservableCollection<TElement> {
    readonly #list: IList<TElement> = new List<TElement>();
    public collectionChanged?: (sender: IObservableCollection<TElement>, args: ICollectionChangedEventArgs<TElement>) => void;

    public constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#list;
    }

    public add(element: TElement): boolean {
        this.#list.add(element);
        this.collectionChanged?.(this, {newItems: new ReadonlyList(new List([element])), action: CollectionChangedAction.Add});
        return true;
    }

    public clear() {
        const oldItems = new ReadonlyList(new List(this.#list.toArray()));
        this.#list.clear();
        this.collectionChanged?.(this, {oldItems, action: CollectionChangedAction.Reset});
    }

    public override contains(element: TElement): boolean {
        return this.#list.contains(element);
    }

    public get(index: number): TElement {
        return this.#list.get(index);
    }

    public insert(index: number, element: TElement) {
        this.#list.addAt(element, index);
        this.collectionChanged?.(this, {newItems: new ReadonlyList(new List([element])), action: CollectionChangedAction.Add});
    }

    public move(oldIndex: number, newIndex: number) {
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
            this.collectionChanged?.(this, {oldItems: new ReadonlyList(new List([element])), action: CollectionChangedAction.Remove});
            return true;
        }
        return false;
    }

    public removeAt(index: number): TElement {
        const element = this.#list.removeAt(index);
        this.collectionChanged?.(this, {oldItems: new ReadonlyList(new List([element])), action: CollectionChangedAction.Remove});
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

    public get length(): number {
        return this.#list.length;
    }
}