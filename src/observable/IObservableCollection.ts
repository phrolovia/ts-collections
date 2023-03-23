import {IEnumerable} from "../../imports";
import {ICollectionChangedEventArgs} from "./ICollectionChangedEventArgs";

export interface IObservableCollection<TElement> extends IEnumerable<TElement> {
    readonly length: number;
    collectionChanged?: (sender: IObservableCollection<TElement>, args: ICollectionChangedEventArgs<TElement>) => void;

    add(element: TElement): void;

    clear(): void;

    contains(element: TElement): boolean;

    get(index: number): TElement;

    insert(index: number, element: TElement): void;

    move(oldIndex: number, newIndex: number): void;

    remove(element: TElement): boolean;

    removeAt(index: number): TElement;

    set(index: number, element: TElement): void;

    size(): number;
}