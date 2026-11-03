import { AbstractEnumerable } from "../enumerator/AbstractEnumerable";
import { Enumerator } from "../enumerator/Enumerator";
import type { IEnumerable } from "../enumerator/IEnumerable";
import { Comparators } from "../shared/Comparators";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import type { OrderComparator } from "../shared/OrderComparator";
import type { Interval } from "./Interval";

type IntervalNode<TPoint, TValue> = {
    height: number;
    readonly id: number;
    readonly interval: Interval<TPoint, TValue>;
    left: IntervalNode<TPoint, TValue> | null;
    maxEnd: TPoint;
    right: IntervalNode<TPoint, TValue> | null;
};

/**
 * Stores closed intervals with values and finds the intervals that overlap a range or contain a
 * point in O(log n + k) time, where k is the number of intervals found.
 * @template TPoint The type of the interval end points, such as numbers or dates.
 * @template TValue The type of the values stored with the intervals.
 * @remarks Intervals are closed, so [1, 3] and [3, 5] overlap at 3. The same interval can be stored more than once. Enumerating yields the intervals ordered by start, then by end, then by the order they were added. The tree is an AVL tree in which every node also records the largest end point below it.
 */
export class IntervalTree<TPoint, TValue = undefined> extends AbstractEnumerable<Interval<TPoint, TValue>> {
    readonly #pointComparator: OrderComparator<TPoint>;
    readonly #valueComparator: EqualityComparator<TValue>;
    #nextId: number = 0;
    #root: IntervalNode<TPoint, TValue> | null = null;
    #size: number = 0;

    /**
     * Creates an interval tree.
     * @param intervals Optional intervals to add, each as a [start, end] or [start, end, value] tuple.
     * @param pointComparator Optional comparator for the end points. Defaults to the library's order comparator, which orders numbers, strings and dates.
     * @param valueComparator Optional comparator that {@link remove} uses to match values.
     */
    public constructor(
        intervals: Iterable<readonly [TPoint, TPoint] | readonly [TPoint, TPoint, TValue]> = [],
        pointComparator?: OrderComparator<TPoint>,
        valueComparator?: EqualityComparator<TValue>
    ) {
        super();
        this.#pointComparator = pointComparator ?? Comparators.orderComparator;
        this.#valueComparator = valueComparator ?? Comparators.equalityComparator;
        for (const interval of intervals) {
            this.add(interval[0], interval[1], interval[2] as TValue);
        }
    }

    * [Symbol.iterator](): Iterator<Interval<TPoint, TValue>> {
        const pending: IntervalNode<TPoint, TValue>[] = [];
        let node = this.#root;
        while (node != null || pending.length > 0) {
            while (node != null) {
                pending.push(node);
                node = node.left;
            }
            node = pending.pop() as IntervalNode<TPoint, TValue>;
            yield node.interval;
            node = node.right;
        }
    }

    /**
     * Adds an interval.
     * @param start The first point of the interval.
     * @param end The last point of the interval.
     * @param value Optional value to store with the interval.
     * @returns {Interval<TPoint, TValue>} The added interval.
     * @throws {InvalidArgumentException} If {@link end} comes before {@link start}.
     */
    public add(start: TPoint, end: TPoint, value?: TValue): Interval<TPoint, TValue> {
        if (this.#pointComparator(start, end) > 0) {
            throw new InvalidArgumentException("The end of an interval cannot come before its start.", "end");
        }
        const interval: Interval<TPoint, TValue> = { end, start, value: value as TValue };
        const node: IntervalNode<TPoint, TValue> = { height: 1, id: this.#nextId++, interval, left: null, maxEnd: end, right: null };
        this.#root = this.#insert(this.#root, node);
        ++this.#size;
        return interval;
    }

    /**
     * Removes every interval.
     */
    public clear(): void {
        this.#root = null;
        this.#size = 0;
    }

    /**
     * Returns a deferred sequence of the intervals that contain a point.
     * @param point The point to look for.
     * @returns {IEnumerable<Interval<TPoint, TValue>>} The intervals whose start is at or before the point and whose end is at or after it, ordered by start.
     */
    public containing(point: TPoint): IEnumerable<Interval<TPoint, TValue>> {
        return this.overlapping(point, point);
    }

    /**
     * Returns a deferred sequence of the intervals that overlap a range.
     * @param start The first point of the range.
     * @param end The last point of the range.
     * @returns {IEnumerable<Interval<TPoint, TValue>>} The intervals that share at least one point with the range, ordered by start.
     * @throws {InvalidArgumentException} If {@link end} comes before {@link start}.
     */
    public overlapping(start: TPoint, end: TPoint): IEnumerable<Interval<TPoint, TValue>> {
        if (this.#pointComparator(start, end) > 0) {
            throw new InvalidArgumentException("The end of a range cannot come before its start.", "end");
        }
        const tree = this.#overlappingNodes.bind(this);
        return new Enumerator(function* (): IterableIterator<Interval<TPoint, TValue>> {
            for (const node of tree(start, end)) {
                yield node.interval;
            }
        });
    }

    /**
     * Removes one interval with the given end points and value.
     * @param start The first point of the interval.
     * @param end The last point of the interval.
     * @param value The value stored with the interval, compared with the tree's value comparator.
     * @returns {boolean} true if an interval is removed, false if there was no such interval.
     */
    public remove(start: TPoint, end: TPoint, value?: TValue): boolean {
        if (this.#pointComparator(start, end) > 0) {
            return false;
        }
        for (const node of this.#overlappingNodes(start, start)) {
            const interval = node.interval;
            if (this.#pointComparator(interval.start, start) === 0 && this.#pointComparator(interval.end, end) === 0
                && this.#valueComparator(interval.value, value as TValue)) {
                this.#root = this.#delete(this.#root, node);
                --this.#size;
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the number of intervals.
     * @returns {number} The number of intervals in the tree.
     */
    public size(): number {
        return this.#size;
    }

    #balance(node: IntervalNode<TPoint, TValue>): IntervalNode<TPoint, TValue> {
        this.#update(node);
        const balance = IntervalTree.#height(node.left) - IntervalTree.#height(node.right);
        if (balance > 1) {
            const left = node.left as IntervalNode<TPoint, TValue>;
            if (IntervalTree.#height(left.left) < IntervalTree.#height(left.right)) {
                node.left = this.#rotateLeft(left);
            }
            return this.#rotateRight(node);
        }
        if (balance < -1) {
            const right = node.right as IntervalNode<TPoint, TValue>;
            if (IntervalTree.#height(right.right) < IntervalTree.#height(right.left)) {
                node.right = this.#rotateRight(right);
            }
            return this.#rotateLeft(node);
        }
        return node;
    }

    #compare(a: IntervalNode<TPoint, TValue>, b: IntervalNode<TPoint, TValue>): number {
        return this.#pointComparator(a.interval.start, b.interval.start)
            || this.#pointComparator(a.interval.end, b.interval.end)
            || a.id - b.id;
    }

    #delete(node: IntervalNode<TPoint, TValue> | null, target: IntervalNode<TPoint, TValue>): IntervalNode<TPoint, TValue> | null {
        if (node == null) {
            return null;
        }
        if (node !== target) {
            if (this.#compare(target, node) < 0) {
                node.left = this.#delete(node.left, target);
            } else {
                node.right = this.#delete(node.right, target);
            }
            return this.#balance(node);
        }
        if (node.left == null || node.right == null) {
            return node.left ?? node.right;
        }
        // Replace the node with its in-order successor, the leftmost node of its right subtree.
        let successor = node.right;
        while (successor.left != null) {
            successor = successor.left;
        }
        successor.right = this.#delete(node.right, successor);
        successor.left = node.left;
        return this.#balance(successor);
    }

    static #height<TPoint, TValue>(node: IntervalNode<TPoint, TValue> | null): number {
        return node?.height ?? 0;
    }

    #insert(node: IntervalNode<TPoint, TValue> | null, added: IntervalNode<TPoint, TValue>): IntervalNode<TPoint, TValue> {
        if (node == null) {
            return added;
        }
        if (this.#compare(added, node) < 0) {
            node.left = this.#insert(node.left, added);
        } else {
            node.right = this.#insert(node.right, added);
        }
        return this.#balance(node);
    }

    // Walks the nodes in order, skipping subtrees that end before the range and stopping at the first node that starts after it.
    * #overlappingNodes(start: TPoint, end: TPoint): IterableIterator<IntervalNode<TPoint, TValue>> {
        const pending: IntervalNode<TPoint, TValue>[] = [];
        let node = this.#root;
        while (node != null || pending.length > 0) {
            while (node != null && this.#pointComparator(node.maxEnd, start) >= 0) {
                pending.push(node);
                node = node.left;
            }
            const next = pending.pop();
            if (next == null || this.#pointComparator(next.interval.start, end) > 0) {
                return;
            }
            if (this.#pointComparator(next.interval.end, start) >= 0) {
                yield next;
            }
            node = next.right;
        }
    }

    #rotateLeft(node: IntervalNode<TPoint, TValue>): IntervalNode<TPoint, TValue> {
        const right = node.right as IntervalNode<TPoint, TValue>;
        node.right = right.left;
        right.left = node;
        this.#update(node);
        this.#update(right);
        return right;
    }

    #rotateRight(node: IntervalNode<TPoint, TValue>): IntervalNode<TPoint, TValue> {
        const left = node.left as IntervalNode<TPoint, TValue>;
        node.left = left.right;
        left.right = node;
        this.#update(node);
        this.#update(left);
        return left;
    }

    #update(node: IntervalNode<TPoint, TValue>): void {
        node.height = 1 + Math.max(IntervalTree.#height(node.left), IntervalTree.#height(node.right));
        let maxEnd = node.interval.end;
        if (node.left != null && this.#pointComparator(node.left.maxEnd, maxEnd) > 0) {
            maxEnd = node.left.maxEnd;
        }
        if (node.right != null && this.#pointComparator(node.right.maxEnd, maxEnd) > 0) {
            maxEnd = node.right.maxEnd;
        }
        node.maxEnd = maxEnd;
    }

    public get length(): number {
        return this.#size;
    }
}
