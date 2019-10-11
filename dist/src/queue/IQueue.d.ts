import { ICollection } from "../core/ICollection";
export interface IQueue<T> extends ICollection<T> {
    /**
     * Retrieves and removes the head of this queue.
     * @return the item at the head of the queue.
     * @throws InvalidOperationException if the queue is empty.
     */
    dequeue(): T;
    /**
     * Inserts the given item into this queue.
     * @param item Item that is to be inserted into the queue.
     */
    enqueue(item: T): void;
    /**
     * Retrieves but not removes the head of the queue.
     * @return the item at the head of the queue. Returns null if the queue is empty.
     */
    peek(): T;
    /**
     * Retrieves and removes the head of the queue.
     * @return the item at the head of the queue. Returns null if the queue is empty.
     */
    poll(): T;
}
