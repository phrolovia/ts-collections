import {IQueue} from "./IQueue";

export interface IDeque<TElement> extends IQueue<TElement> {
    dequeueLast(): TElement;
    enqueueFirst(element: TElement): void;
    peekLast(): TElement;
    pollLast(): TElement;
}
