import {Queue} from "./Queue";
import {EqualityComparator} from "../shared/EqualityComparator";

/**
 * A circular queue is a queue that uses a fixed-size queue as its underlying data structure.
 * When the queue is full, adding a new element to the queue causes the oldest element in the queue to be removed.
 * The oldest element is the one that has been in the queue the longest, which is the element at the front of the queue.
 *
 * This is a first-in-first-out (FIFO) data structure.
 * @see https://en.wikipedia.org/wiki/Circular_buffer
 */
export class CircularQueue<TElement> extends Queue<TElement> {
    private readonly capacity: number = 32;

    /**
     * Constructs a circular queue with the default capacity of 32.
     *
     */
    public constructor();

    /**
     * Constructs a circular queue with the given capacity.
     * @param capacity The capacity of the queue.
     */
    public constructor(capacity: number);

    /**
     * Constructs a circular queue with the given capacity.
     * @param capacity The capacity of the queue.
     * @param comparator The comparator used to compare the elements of the queue.
     */
    public constructor(capacity?: number, comparator?: EqualityComparator<TElement>) {
        super([], comparator);
        this.capacity = capacity;
    }

    /**
     * Adds an element to the queue.
     * If the queue is full, the oldest element in the queue is removed.
     * @param element The element to add to the queue.
     * @returns true if the element was added to the queue, false otherwise.
     */
    public override add(element: TElement): boolean {
        if (this.size() === this.capacity) {
            this.poll();
        }
        return super.add(element);
    }

    /**
     * Adds an element to the queue.
     * If the queue is full, the oldest element in the queue is removed.
     * @param element The element to add to the queue.
     */
    public override enqueue(element: TElement): void {
        this.add(element);
    }

    /**
     * Returns if the queue is full.
     * @returns true if the queue is full, false otherwise.
     */
    public isFull(): boolean {
        return this.size() === this.capacity;
    }
}