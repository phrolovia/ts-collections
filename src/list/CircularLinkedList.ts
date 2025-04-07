import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexOutOfBoundsException } from "../shared/IndexOutOfBoundsException";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { NoElementsException } from "../shared/NoElementsException";
import { OrderComparator } from "../shared/OrderComparator";
import { AbstractList } from "./AbstractList";

// Internal Node class specifically for CircularLinkedList
// Maintains references to the previous and next nodes in the circle.
class Node<TElement> {
    public item: TElement;
    public next: Node<TElement> | null; // Should always point to another node in a non-empty list
    public prev: Node<TElement> | null; // Should always point to another node in a non-empty list

    /**
     * Constructs a new Node.
     * @param prev The previous node in the list.
     * @param item The data element stored in the node.
     * @param next The next node in the list.
     */
    public constructor(prev: Node<TElement> | null, item: TElement, next: Node<TElement> | null) {
        this.prev = prev;
        this.item = item;
        this.next = next;
    }
}

/**
 * Represents a circular doubly linked list.
 * In a circular linked list, the last node points to the first node (head.prev -> tail),
 * and the first node points to the last node (tail.next -> head), forming a circle.
 * This implementation uses a single 'head' reference, where head.prev gives the tail.
 */
export class CircularLinkedList<TElement> extends AbstractList<TElement> {
    #head: Node<TElement> | null = null;
    #listSize: number = 0;

    /**
     * Initializes a new instance of the CircularLinkedList class.
     * @param iterable An optional iterable to populate the list with.
     * @param comparator An optional equality comparator for elements.
     */
    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator?: EqualityComparator<TElement>
    ) {
        super(comparator ?? Comparators.equalityComparator);
        for (const element of iterable) {
            this.add(element);
        }
    }

    /**
     * Gets an iterator for the circular linked list.
     * Iterates through the list starting from the head node.
     * @returns {Iterator<TElement>} An iterator for the list.
     */
    * [Symbol.iterator](): Iterator<TElement> {
        if (!this.#head) {
            return;
        }
        let currentNode = this.#head;
        let count = 0;
        // Iterate through the list using next pointers until we wrap back to the head.
        // The count check prevents infinite loops in case of list corruption (unlikely).
        do {
            yield currentNode.item;
            currentNode = currentNode.next!;
            count++;
        } while (currentNode !== this.#head && count < this.#listSize);
    }

    /**
     * Adds an element to the end of the list.
     * @param element The element to add.
     * @returns {boolean} Always returns true as the add operation succeeds.
     */
    public override add(element: TElement): boolean {
        this.addLast(element);
        return true;
    }

    /**
     * Adds an element at the specified index in the list.
     * @param element The element to add.
     * @param index The zero-based index at which the element should be inserted.
     * @returns {boolean} Always returns true as the add operation succeeds.
     * @throws {IndexOutOfBoundsException} If the index is out of range (index < 0 or index > size).
     */
    public addAt(element: TElement, index: number): boolean {
        this.checkPositionIndex(index);

        if (index === 0) {
            this.addFirst(element);
        } else if (index === this.#listSize) {
            this.addLast(element);
        } else {
            const successor = this.node(index);
            const predecessor = successor.prev!;
            const newNode = new Node<TElement>(predecessor, element, successor);
            successor.prev = newNode;
            predecessor.next = newNode;
            this.#listSize++;
        }
        return true;
    }

    /**
     * Adds an element to the beginning of the list.
     * @param element The element to add.
     */
    public addFirst(element: TElement): void {
        const oldHead = this.#head;
        const newNode = new Node<TElement>(null, element, null);

        if (oldHead === null) {
            newNode.next = newNode;
            newNode.prev = newNode;
            this.#head = newNode;
        } else {
            const tail = oldHead.prev!;
            newNode.next = oldHead;
            newNode.prev = tail;
            oldHead.prev = newNode;
            tail.next = newNode;
            this.#head = newNode;
        }
        this.#listSize++;
    }

    /**
     * Adds an element to the end of the list.
     * @param element The element to add.
     */
    public addLast(element: TElement): void {
        const oldHead = this.#head;
        const newNode = new Node<TElement>(null, element, null);

        if (oldHead === null) {
            newNode.next = newNode;
            newNode.prev = newNode;
            this.#head = newNode;
        } else {
            const tail = oldHead.prev!;
            newNode.next = oldHead;
            newNode.prev = tail;
            tail.next = newNode;
            oldHead.prev = newNode;
        }
        this.#listSize++;
    }

    /**
     * Removes all elements from the list.
     */
    public clear(): void {
        if (this.#head) {
            let current = this.#head;
            for (let i = 0; i < this.#listSize; i++) {
                const nextNode = current.next;
                current.next = null;
                current.prev = null;
                current = nextNode!;
                if (current === this.#head && i === this.#listSize - 1) {
                    break;
                } else if (nextNode === this.#head && i < this.#listSize - 1) {
                    current = nextNode;
                } else if (nextNode === null) {
                    break;
                }
            }
        }
        this.#head = null;
        this.#listSize = 0;
    }

    /**
     * Determines whether the list contains a specific element.
     * @param element The element to locate.
     * @param comparator An optional equality comparator.
     * @returns {boolean} True if the element is found; otherwise, false.
     */
    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.indexOf(element, comparator) !== -1;
    }

    /**
     * Gets the element at the specified zero-based index.
     * @param index The index of the element to retrieve.
     * @returns {TElement} The element at the specified index.
     * @throws {IndexOutOfBoundsException} If the index is out of range (index < 0 or index >= size).
     */
    public get(index: number): TElement {
        this.checkElementIndex(index);
        return this.node(index).item;
    }

    /**
     * Gets a range of elements starting from the specified index.
     * The range wraps around the list if necessary.
     * @param index The zero-based starting index of the range.
     * @param count The number of elements in the range.
     * @returns {CircularLinkedList<TElement>} A new CircularLinkedList containing the specified range.
     * @throws {IndexOutOfBoundsException} If the index is out of range (index < 0 or index >= size, or index > 0 for an empty list).
     * @throws {InvalidArgumentException} If count is negative.
     */
    public override getRange(index: number, count: number): CircularLinkedList<TElement> {
        if (index < 0) {
            throw new IndexOutOfBoundsException(`Index ${index} cannot be negative.`);
        }
        if (count < 0) {
            throw new InvalidArgumentException("Count must be non-negative.", "count");
        }

        if (this.isEmpty()) {
            if (index > 0) {
                throw new IndexOutOfBoundsException(`Index ${index} is out of bounds for an empty list.`);
            }
        } else if (index >= this.size()) {
            throw new IndexOutOfBoundsException(`Index ${index} is out of bounds for non-empty list size ${this.size()}.`);
        }

        const rangeList = new CircularLinkedList<TElement>([], this.comparator);

        if (count === 0) {
            return rangeList;
        }

        if (this.isEmpty()) {
            if (index < 0) {
                throw new IndexOutOfBoundsException(`Index ${index} cannot be negative.`);
            }
            if (count < 0) {
                throw new InvalidArgumentException("Count must be non-negative.", "count");
            }
            if (this.isEmpty()) {
                if (index > 0 || count > 0) {
                    throw new IndexOutOfBoundsException(`Index ${index} or count ${count} is invalid for an empty list.`);
                }
            } else if (index >= this.size()) {
                throw new IndexOutOfBoundsException(`Index ${index} is out of bounds for list size ${this.size()}.`);
            }
            if (count === 0) {
                return rangeList;
            }
        }

        let currentNode = this.node(index);
        for (let i = 0; i < count; ++i) {
            rangeList.add(currentNode.item);
            currentNode = currentNode.next!;
        }
        return rangeList;
    }

    /**
     * Removes the element at the specified index.
     * @param index The zero-based index of the element to remove.
     * @returns {TElement} The element that was removed.
     * @throws {IndexOutOfBoundsException} If the index is out of range.
     */
    public removeAt(index: number): TElement {
        this.checkElementIndex(index);
        const nodeToRemove = this.node(index);
        return this.unlink(nodeToRemove);
    }

    /**
     * Removes the first occurrence of the specified element from the list.
     * @param element The element to remove.
     * @returns {boolean} True if the element was found and removed; otherwise, false.
     */
    public override remove(element: TElement): boolean {
        if (this.#head === null) {
            return false;
        }
        const comparator = this.comparer;
        let current: Node<TElement> | null = this.#head;
        let iterations = 0;

        do {
            if (comparator(current!.item, element)) {
                this.unlink(current!);
                return true;
            }
            current = current!.next;
            iterations++;
        } while (current !== this.#head && iterations <= this.#listSize);

        return false;
    }

    /**
     * Removes and returns the first element from the list.
     * @returns {TElement} The removed element.
     * @throws {NoElementsException} If the list is empty.
     */
    public removeFirst(): TElement {
        if (this.#head === null) {
            throw new NoElementsException("Cannot remove from an empty list.");
        }
        return this.unlink(this.#head);
    }

    /**
     * Removes and returns the last element from the list.
     * @returns {TElement} The removed element.
     * @throws {NoElementsException} If the list is empty.
     */
    public removeLast(): TElement {
        if (this.#head === null || this.#head.prev === null) {
            throw new NoElementsException("Cannot remove from an empty list.");
        }
        return this.unlink(this.#head.prev);
    }

    /**
     * Replaces the element at the specified index with a new element.
     * @param index The zero-based index of the element to replace.
     * @param element The new element.
     * @returns {TElement} The original element that was replaced.
     * @throws {IndexOutOfBoundsException} If the index is out of range.
     */
    public set(index: number, element: TElement): TElement {
        this.checkElementIndex(index);
        const node = this.node(index);
        const oldElement = node.item;
        node.item = element;
        return oldElement;
    }

    /**
     * Gets the number of elements contained in the list.
     * @returns {number} The number of elements.
     */
    public size(): number {
        return this.#listSize;
    }

    /**
     * Sorts the elements in the list in place.
     * Note: This converts the list to an array, sorts it, and rebuilds the list.
     * @param comparator An optional order comparator.
     */
    public sort(comparator?: OrderComparator<TElement>): void {
        if (this.#listSize < 2) {
            return;
        }
        const array = this.toArray();
        comparator ??= Comparators.orderComparator;
        array.sort(comparator);

        this.clear();
        for (const element of array) {
            this.add(element);
        }
    }

    /**
     * Checks if the index is valid for accessing an element (0 <= index < size).
     * @param index The index to check.
     * @throws {IndexOutOfBoundsException} If the index is invalid.
     */
    private checkElementIndex(index: number): void {
        if (!this.isElementIndex(index)) {
            throw new IndexOutOfBoundsException(`Index ${index} is out of bounds for list size ${this.#listSize}.`);
        }
    }

    /**
     * Checks if the index is valid for insertion (0 <= index <= size).
     * @param index The index to check.
     * @throws {IndexOutOfBoundsException} If the index is invalid.
     */
    private checkPositionIndex(index: number): void {
        if (!this.isPositionIndex(index)) {
            throw new IndexOutOfBoundsException(`Index ${index} is out of bounds for insertion into list size ${this.#listSize}.`);
        }
    }

    /**
     * Helper to check if an index is within the bounds for element access.
     * @param index The index.
     * @returns {boolean} True if valid for element access.
     */
    private isElementIndex(index: number): boolean {
        return index >= 0 && index < this.#listSize;
    }

    /**
     * Helper to check if an index is within the bounds for insertion.
     * @param index The index.
     * @returns {boolean} True if valid for insertion.
     */
    private isPositionIndex(index: number): boolean {
        return index >= 0 && index <= this.#listSize;
    }

    /**
     * Retrieves the node at the specified index. Traverses from the closer end.
     * @param index The zero-based index.
     * @returns {Node<TElement>} The node at the index.
     * @throws {IndexOutOfBoundsException} If index is invalid (handled by caller).
     */
    private node(index: number): Node<TElement> {
        if (this.#head === null) {
            throw new IndexOutOfBoundsException("Attempted to access node in an empty list.");
        }

        let current: Node<TElement>;
        // Optimization: Traverse from the closer end (head or tail via head.prev)
        if (index < (this.#listSize >> 1)) { // Closer to head
            current = this.#head;
            for (let i = 0; i < index; i++) {
                current = current.next!; // Safe due to size check
            }
        } else { // Closer to tail
            current = this.#head; // Start from head
            // To get to index `idx` from the end, we need `size - 1 - idx` steps backward from tail
            // Or `size - idx` steps backward from head.
            for (let i = 0; i < this.#listSize - index; i++) {
                current = current.prev!; // Safe due to size check
            }
        }
        return current;
    }

    /**
     * Removes a specified node from the list and updates links.
     * @param node The node to remove.
     * @returns {TElement} The element of the removed node.
     */
    private unlink(node: Node<TElement>): TElement {
        const element = node.item;
        const nextNode = node.next!;
        const prevNode = node.prev!;

        if (this.#listSize === 1) {
            this.#head = null;
        } else {
            prevNode.next = nextNode;
            nextNode.prev = prevNode;
            if (node === this.#head) {
                this.#head = nextNode;
            }
        }
        node.next = null;
        node.prev = null;
        this.#listSize--;
        return element;
    }

    /**
     * Gets the equality comparator used by the list.
     * @returns {EqualityComparator<TElement>} The comparator.
     */
    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.#listSize;
    }
}
