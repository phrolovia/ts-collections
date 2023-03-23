import {ReadonlyList} from "../../imports";

export interface ICollectionChangedEventArgs<TElement> {
    action: CollectionChangedAction;
    newItems?: ReadonlyList<TElement>;
    oldItems?: ReadonlyList<TElement>;
}

export enum CollectionChangedAction {
    Add = 0,
    Remove = 1,
    Replace = 2,
    Move = 3,
    Reset = 4
}