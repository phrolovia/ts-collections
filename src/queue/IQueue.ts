import {ICollection} from "../../imports";

export interface IQueue<TElement> extends ICollection<TElement> {
    dequeue(): TElement;
    enqueue(element: TElement): void;
    peek(): TElement;
    poll(): TElement;
}
