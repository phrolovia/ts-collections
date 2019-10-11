import { IQueue } from "./IQueue";

export interface IDeque<T> extends IQueue<T> {
    /**
     * Retrieves and removes the last item of this deque.
     * @return the item at the end of the deque.
     * @throws InvalidOperationException if the deque is empty.
     */
    dequeueLast(): T;
    
    /**
     * Inserts the given item into the beginning of this deque.
     * @param item Item that is to be inserted into the deque.
     */
    enqueueFirst(item: T): void;
    
    /**
     * Retrieves but not removes the last item of this deque.
     * @return the item at the end of the deque. Returns null if the deque is empty.
     */
    peekLast(): T;
    
    /**
     * Retrieves and removes the last item of this deque.
     * @return the item at the end of the deque. Returns null if the deque is empty.
     */
    pollLast(): T;
}