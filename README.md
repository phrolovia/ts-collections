# ts-collections

A comprehensive TypeScript library providing a rich set of common data structures and utility functions, designed for performance, immutability, and ease of use.

## Table of Contents
*   [Getting Started](#getting-started)
*   [List-like Collections](#list-like-collections)
    *   [List](#list)
    *   [LinkedList](#linkedlist)
    *   [CircularLinkedList](#circularlinkedlist)
    *   [ImmutableList](#immutablelist)
*   [Stack-like Collections](#stack-like-collections)
    *   [Stack](#stack)
    *   [ImmutableStack](#immutablestack)
*   [Queue-like Collections](#queue-like-collections)
    *   [Queue](#queue)
    *   [CircularQueue](#circularqueue)
    *   [PriorityQueue](#priorityqueue)
    *   [ImmutableQueue](#immutablequeue)
    *   [ImmutableCircularQueue](#immutablecircularqueue)
    *   [ImmutablePriorityQueue](#immutablepriorityqueue)
*   [Set-like Collections](#set-like-collections)
    *   [EnumerableSet](#enumerableset)
    *   [ImmutableSet](#immutableset)
    *   [SortedSet](#sortedset)
    *   [ImmutableSortedSet](#immutablesortedset)
*   [Dictionary-like Collections](#dictionary-like-collections)
    *   [Dictionary](#dictionary)
    *   [ImmutableDictionary](#immutabledictionary)
    *   [SortedDictionary](#sorteddictionary)
    *   [ImmutableSortedDictionary](#immutabledictionary)
    *   [Lookup](#lookup)
*   [Tree-based Collections](#tree-based-collections)
    *   [RedBlackTree](#redblacktree)
*   [Heap-based Collections](#heap-based-collections)
    *   [Heap](#heap)
    *   [ImmutableHeap](#immutableheap)
*   [Readonly Collections](#readonly-collections)
    *   [ReadonlyCollection](#readonlycollection)
    *   [ReadonlyList](#readonlylist)
    *   [ReadonlyDictionary](#readonlydictionary)
*   [Enumerators](#enumerators)
    *   [Enumerable](#enumerable)
    *   [AsyncEnumerable](#asyncenumerable)
*   [API](#api)
---

## Getting Started

```shell
npm i @mirei/ts-collections
```

## List-like Collections

Lists are ordered collections that allow duplicate elements and provide index-based access.

### List

A dynamic array-based implementation of a list.

*   **Definition**: A resizable array that allows for efficient random access and modification.
*   **How to use**:
    ```typescript
    import { List } from '@mirei/ts-collections';

    const list = new List([1, 2, 3]);
    list.add(4); // [1, 2, 3, 4]
    list.removeAt(0); // [2, 3, 4]
    console.log(list.get(1)); // 3
    ```
*   **Pros**:
    *   Fast random access by index (O(1)).
    *   Efficient addition/removal at the end (amortized O(1)).
    *   Good cache locality.
*   **Cons**:
    *   Inefficient insertions/deletions in the middle or at the beginning (O(n)).
    *   Resizing can incur performance overhead.

### LinkedList

A doubly-linked list implementation.

*   **Definition**: A linear collection of elements where each element (node) points to the next and previous elements.
*   **How to use**:
    ```typescript
    import { LinkedList } from '@mirei/ts-collections';

    const linkedList = new LinkedList([1, 2, 3]);
    linkedList.addFirst(0); // [0, 1, 2, 3]
    linkedList.addLast(4); // [0, 1, 2, 3, 4]
    linkedList.removeFirst(); // [1, 2, 3, 4]
    ```
*   **Pros**:
    *   Efficient insertions and deletions at any position (O(1) if the position is known, O(n) otherwise).
    *   No resizing overhead.
*   **Cons**:
    *   Slow random access by index (O(n)).
    *   Higher memory overhead due to storing pointers.

### CircularLinkedList

A circular doubly-linked list implementation where the last node points to the first node and the first node points to the last node, forming a circle.

*   **Definition**: A linked list where the last element points back to the first element, creating a continuous loop.
*   **How to use**:
    ```typescript
    import { CircularLinkedList } from '@mirei/ts-collections';

    const circularList = new CircularLinkedList([1, 2, 3]);
    circularList.addFirst(0); // [0, 1, 2, 3]
    circularList.addLast(4); // [0, 1, 2, 3, 4]
    // Traversal can wrap around
    ```
*   **Pros**:
    *   Efficient operations at both ends (O(1)).
    *   Allows continuous traversal without explicit checks for the end of the list.
    *   Useful for cyclic data structures or round-robin scheduling.
*   **Cons**:
    *   Slow random access by index (O(n)).
    *   More complex to implement and manage than a standard linked list.

### ImmutableList

An immutable version of `List`. Any operation that would modify the list returns a new `ImmutableList` instance, leaving the original unchanged.

*   **Definition**: A list whose contents cannot be changed after creation. Operations that appear to modify it instead return a new list.
*   **How to use**:
    ```typescript
    import { ImmutableList } from '@mirei/ts-collections';

    const list = ImmutableList.create([1, 2, 3]);
    const newList = list.add(4); // list is still [1, 2, 3], newList is [1, 2, 3, 4]
    ```
*   **Pros**:
    *   Predictable behavior and easier reasoning about state.
    *   Thread-safe (no concurrent modification issues).
    *   Facilitates functional programming paradigms.
*   **Cons**:
    *   Can incur performance overhead due to frequent object creation for modifications.
    *   Higher memory usage if many intermediate versions are kept.

## Stack-like Collections

Stacks are LIFO (Last-In-First-Out) collections.

### Stack

A standard stack implementation.

*   **Definition**: A collection that follows the Last-In, First-Out (LIFO) principle. Elements are added and removed from the same end, called the "top".
*   **How to use**:
    ```typescript
    import { Stack } from '@mirei/ts-collections';

    const stack = new Stack<number>();
    stack.push(1); // [1]
    stack.push(2); // [1, 2]
    console.log(stack.peek()); // 2
    console.log(stack.pop()); // 2, stack is now [1]
    ```
*   **Pros**:
    *   Extremely fast push and pop operations (O(1)).
    *   Simple to understand and implement.
*   **Cons**:
    *   Limited access pattern (only top element is easily accessible).

### ImmutableStack

An immutable version of `Stack`. Any operation that would modify the stack returns a new `ImmutableStack` instance, leaving the original unchanged.

*   **Definition**: A stack whose contents cannot be changed after creation. Operations that appear to modify it instead return a new stack.
*   **How to use**:
    ```typescript
    import { ImmutableStack } from '@mirei/ts-collections';

    const stack = ImmutableStack.create([1, 2]);
    const newStack = stack.push(3); // stack is [1, 2], newStack is [1, 2, 3]
    ```
*   **Pros**:
    *   Benefits of immutability (predictability, thread-safety).
    *   Useful in functional programming and state management.
*   **Cons**:
    *   Performance overhead for modifications due to new object creation.

## Queue-like Collections

Queues are FIFO (First-In-First-Out) collections.

### Queue

A standard queue implementation.

*   **Definition**: A collection that follows the First-In, First-Out (FIFO) principle. Elements are added to one end (rear) and removed from the other (front).
*   **How to use**:
    ```typescript
    import { Queue } from '@mirei/ts-collections';

    const queue = new Queue<string>();
    queue.enqueue("first"); // ["first"]
    queue.enqueue("second"); // ["first", "second"]
    console.log(queue.peek()); // "first"
    console.log(queue.dequeue()); // "first", queue is now ["second"]
    ```
*   **Pros**:
    *   Extremely fast enqueue and dequeue operations (O(1)).
    *   Simple and efficient for managing ordered tasks or data streams.
*   **Cons**:
    *   Limited access pattern (only front element is easily accessible).

### CircularQueue

A fixed-size queue that overwrites the oldest elements when full.

*   **Definition**: A queue with a fixed capacity. When the queue is full and a new element is enqueued, the oldest element is automatically removed to make space.
*   **How to use**:
    ```typescript
    import { CircularQueue } from '@mirei/ts-collections';

    const circularQueue = new CircularQueue<number>(3); // Capacity of 3
    circularQueue.enqueue(1); // [1]
    circularQueue.enqueue(2); // [1, 2]
    circularQueue.enqueue(3); // [1, 2, 3]
    circularQueue.enqueue(4); // [2, 3, 4] (1 is overwritten)
    ```
*   **Pros**:
    *   Memory efficient for fixed-size buffers.
    *   Useful for logging, history, or streaming data where only the most recent N items are needed.
*   **Cons**:
    *   Fixed capacity can lead to data loss if not managed carefully.

### PriorityQueue

A queue where elements are dequeued according to their priority.

*   **Definition**: A queue-like structure where each element has a priority. Elements with higher priority are served before elements with lower priority.
*   **How to use**:
    ```typescript
    import { PriorityQueue } from '@mirei/ts-collections';

    // Min-priority queue (smallest number has highest priority)
    const pq = new PriorityQueue<number>();
    pq.enqueue(3);
    pq.enqueue(1);
    pq.enqueue(4);
    console.log(pq.dequeue()); // 1
    console.log(pq.dequeue()); // 3
    ```
*   **Pros**:
    *   Efficient retrieval of the highest (or lowest) priority element (O(1) peek, O(log n) dequeue).
    *   Useful for task scheduling, event simulation, or graph algorithms (e.g., Dijkstra's).
*   **Cons**:
    *   Enqueue and dequeue operations are O(log n), slower than a regular queue.

### ImmutableQueue

An immutable version of `Queue`. Any operation that would modify the queue returns a new `ImmutableQueue` instance, leaving the original unchanged.

*   **Definition**: A queue whose contents cannot be changed after creation. Operations that appear to modify it instead return a new queue.
*   **How to use**:
    ```typescript
    import { ImmutableQueue } from '@mirei/ts-collections';

    const queue = ImmutableQueue.create([1, 2]);
    const newQueue = queue.enqueue(3); // queue is [1, 2], newQueue is [1, 2, 3]
    ```
*   **Pros**:
    *   Benefits of immutability.
    *   Useful in scenarios requiring persistent queue states.
*   **Cons**:
    *   Performance overhead for modifications.

### ImmutableCircularQueue

An immutable version of `CircularQueue`. Any operation that would modify the queue returns a new `ImmutableCircularQueue` instance, leaving the original unchanged.

*   **Definition**: An immutable circular queue.
*   **How to use**:
    ```typescript
    import { ImmutableCircularQueue } from '@mirei/ts-collections';

    const queue = ImmutableCircularQueue.create([1, 2], 3);
    const newQueue = queue.enqueue(3); // queue is [1, 2], newQueue is [1, 2, 3]
    const newerQueue = newQueue.enqueue(4); // newQueue is [1, 2, 3], newerQueue is [2, 3, 4]
    ```
*   **Pros**:
    *   Combines benefits of circular queues and immutability.
*   **Cons**:
    *   Performance overhead for modifications.

### ImmutablePriorityQueue

An immutable version of `PriorityQueue`. Any operation that would modify the queue returns a new `ImmutablePriorityQueue` instance, leaving the original unchanged.

*   **Definition**: An immutable priority queue.
*   **How to use**:
    ```typescript
    import { ImmutablePriorityQueue } from '@mirei/ts-collections';

    const pq = ImmutablePriorityQueue.create([3, 1, 4]);
    const newPq = pq.enqueue(2); // pq is [1, 3, 4], newPq is [1, 2, 3, 4]
    ```
*   **Pros**:
    *   Combines benefits of priority queues and immutability.
*   **Cons**:
    *   Performance overhead for modifications.

## Set-like Collections

Sets are collections of unique elements.

### EnumerableSet

A set implementation based on JavaScript's `Set`.

*   **Definition**: A collection that stores unique elements, disallowing duplicates.
*   **How to use**:
    ```typescript
    import { EnumerableSet } from '@mirei/ts-collections';

    const set = new EnumerableSet([1, 2, 2, 3]); // set is {1, 2, 3}
    set.add(4); // {1, 2, 3, 4}
    console.log(set.has(2)); // true
    set.delete(1); // {2, 3, 4}
    ```
*   **Pros**:
    *   Fast lookups, insertions, and deletions (average O(1)).
    *   Guarantees uniqueness of elements.
    *   Supports standard set operations (union, intersection, difference).
*   **Cons**:
    *   Elements are not stored in any particular order.

### ImmutableSet

An immutable version of `EnumerableSet`. Any operation that would modify the set returns a new `ImmutableSet` instance, leaving the original unchanged.

*   **Definition**: An immutable set.
*   **How to use**:
    ```typescript
    import { ImmutableSet } from '@mirei/ts-collections';

    const set = ImmutableSet.create([1, 2]);
    const newSet = set.add(3); // set is {1, 2}, newSet is {1, 2, 3}
    ```
*   **Pros**:
    *   Benefits of immutability.
*   **Cons**:
    *   Performance overhead for modifications.

### SortedSet

A set implementation that keeps elements sorted using a Red-Black Tree.

*   **Definition**: A set that maintains its elements in a sorted order.
*   **How to use**:
    ```typescript
    import { SortedSet } from '@mirei/ts-collections';

    const sortedSet = new SortedSet([3, 1, 4, 2]);
    // Iteration will be in order: 1, 2, 3, 4
    ```
*   **Pros**:
    *   Elements are always sorted, allowing for efficient range queries.
    *   Guaranteed O(log n) for insertions, deletions, and lookups.
*   **Cons**:
    *   Slower than `EnumerableSet` for basic operations due to sorting overhead.

### ImmutableSortedSet

An immutable version of `SortedSet`. Any operation that would modify the set returns a new `ImmutableSortedSet` instance, leaving the original unchanged.

*   **Definition**: An immutable sorted set.
*   **How to use**:
    ```typescript
    import { ImmutableSortedSet } from '@mirei/ts-collections';

    const sortedSet = ImmutableSortedSet.create([3, 1, 4]);
    const newSortedSet = sortedSet.add(2); // sortedSet is {1, 3, 4}, newSortedSet is {1, 2, 3, 4}
    ```
*   **Pros**:
    *   Combines benefits of sorted sets and immutability.
*   **Cons**:
    *   Performance overhead for modifications.

## Dictionary-like Collections

Dictionaries are collections of key-value pairs where each key is unique.

### Dictionary

A hash-based implementation of a dictionary using JavaScript's `Map`.

*   **Definition**: A collection that stores key-value pairs, where each key is unique and maps to a single value.
*   **How to use**:
    ```typescript
    import { Dictionary } from '@mirei/ts-collections';

    const dict = new Dictionary<string, number>();
    dict.set("apple", 1);
    dict.set("banana", 2);
    console.log(dict.get("apple")); // 1
    dict.delete("banana");
    ```
*   **Pros**:
    *   Fast lookups, insertions, and deletions (average O(1)).
    *   Keys can be of any type (objects, primitives).
*   **Cons**:
    *   Keys are not ordered.

### ImmutableDictionary

An immutable version of `Dictionary`. Any operation that would modify the dictionary returns a new `ImmutableDictionary` instance, leaving the original unchanged.

*   **Definition**: An immutable dictionary.
*   **How to use**:
    ```typescript
    import { ImmutableDictionary } from '@mirei/ts-collections';

    const dict = ImmutableDictionary.create<string, number>();
    const newDict = dict.add("apple", 1); // dict is empty, newDict is {"apple": 1}
    ```
*   **Pros**:
    *   Benefits of immutability.
*   **Cons**:
    *   Performance overhead for modifications.

### SortedDictionary

A dictionary implementation that keeps keys sorted using a Red-Black Tree.

*   **Definition**: A dictionary that maintains its key-value pairs in a sorted order based on its keys.
*   **How to use**:
    ```typescript
    import { SortedDictionary } from '@mirei/ts-collections';

    const sortedDict = new SortedDictionary<number, string>();
    sortedDict.set(3, "three");
    sortedDict.set(1, "one");
    sortedDict.set(2, "two");
    // Iteration will be in key order: 1, 2, 3
    ```
*   **Pros**:
    *   Keys are always sorted, allowing for efficient range queries and ordered iteration.
    *   Guaranteed O(log n) for insertions, deletions, and lookups.
*   **Cons**:
    *   Slower than `Dictionary` for basic operations due to sorting overhead.

### ImmutableSortedDictionary

An immutable version of `SortedDictionary`. Any operation that would modify the dictionary returns a new `ImmutableSortedDictionary` instance, leaving the original unchanged.

*   **Definition**: An immutable sorted dictionary.
*   **How to use**:
    ```typescript
    import { ImmutableSortedDictionary } from '@mirei/ts-collections';

    const dict = ImmutableSortedDictionary.create<number, string>();
    const newDict = dict.add(3, "three").add(1, "one"); // dict is empty, newDict has {1: "one", 3: "three"}
    ```
*   **Pros**:
    *   Combines benefits of sorted dictionaries and immutability.
*   **Cons**:
    *   Performance overhead for modifications.

### Lookup

A collection that maps keys to collections of values.

*   **Definition**: A data structure that groups elements by a key, where each key can be associated with multiple values. Similar to `Map<K, V[]>` but with specialized methods.
*   **How to use**:
    ```typescript
    import { Lookup } from '@mirei/ts-collections';

    const data = [
        { category: "A", value: 1 },
        { category: "B", value: 2 },
        { category: "A", value: 3 }
    ];
    const lookup = Lookup.create(
        data,
        item => item.category,
        item => item.value
    );
    console.log(lookup.get("A").toArray()); // [1, 3]
    ```
*   **Pros**:
    *   Efficiently groups data by a key.
    *   Provides a convenient way to access all values associated with a specific key.
*   **Cons**:
    *   Can be less memory efficient than a simple `Map` if keys have very few associated values.

## Tree-based Collections

### RedBlackTree

A self-balancing binary search tree implementation.

*   **Definition**: A type of self-balancing binary search tree, which guarantees that the tree remains balanced during insertions and deletions, ensuring logarithmic time complexity for operations.
*   **How to use**:
    ```typescript
    import { RedBlackTree } from '@mirei/ts-collections';

    const tree = new RedBlackTree<number>();
    tree.insert(5);
    tree.insert(3);
    tree.insert(7);
    console.log(tree.search(3)); // true
    tree.delete(5);
    ```
*   **Pros**:
    *   Guaranteed O(log n) time complexity for search, insertion, and deletion.
    *   Maintains sorted order of elements.
    *   Efficient for large datasets where frequent modifications and lookups are needed.
*   **Cons**:
    *   More complex to implement than a basic binary search tree.
    *   Higher constant factors for operations compared to hash-based structures.

## Heap-based Collections

### Heap

A binary heap implementation.

*   **Definition**: A specialized tree-based data structure that satisfies the heap property: if P is a parent node of C, then the value of P is either greater than or equal to (max heap) or less than or equal to (min heap) the value of C.
*   **How to use**:
    ```typescript
    import { Heap } from '@mirei/ts-collections';

    // Min-heap
    const minHeap = new Heap<number>();
    minHeap.add(5);
    minHeap.add(1);
    minHeap.add(3);
    console.log(minHeap.peek()); // 1
    minHeap.poll(); // Removes 1
    ```
*   **Pros**:
    *   Efficiently finds the minimum or maximum element (O(1) peek).
    *   Efficient insertion and deletion of the min/max element (O(log n)).
    *   Foundation for priority queues and heap sort.
*   **Cons**:
    *   Only the root element is easily accessible.
    *   Not suitable for general searching or ordered traversal.

### ImmutableHeap

An immutable version of `Heap`. Any operation that would modify the heap returns a new `ImmutableHeap` instance, leaving the original unchanged.

*   **Definition**: An immutable heap.
*   **How to use**:
    ```typescript
    import { ImmutableHeap } from '@mirei/ts-collections';

    const heap = ImmutableHeap.create([5, 1, 3]);
    const newHeap = heap.add(2); // heap is [1, 3, 5], newHeap is [1, 2, 3, 5]
    ```
*   **Pros**:
    *   Combines benefits of heaps and immutability.
*   **Cons**:
    *   Performance overhead for modifications.

## Readonly Collections

Readonly collections are wrappers that provide read-only access to underlying collections.

### ReadonlyCollection

A wrapper around an `ICollection` that provides read-only access to the underlying collection.

*   **Definition**: A generic read-only view of any collection, preventing modifications through this wrapper.
*   **How to use**:
    ```typescript
    import { List, ReadonlyCollection } from '@mirei/ts-collections';

    const mutableList = new List([1, 2, 3]);
    const readonlyView = new ReadonlyCollection(mutableList);

    console.log(readonlyView.contains(2)); // true
    // readonlyView.add(4); // Error: Property 'add' does not exist on type 'ReadonlyCollection<number>'

    mutableList.add(4); // Modify the underlying collection
    console.log(readonlyView.contains(4)); // true (reflects changes in underlying collection)
    ```
*   **Pros**:
    *   Provides a safe way to expose collection data without allowing external modification.
    *   Ensures data integrity when passing collections to functions that should not alter them.
*   **Cons**:
    *   Does not prevent modification of the *underlying* collection if a reference to it exists elsewhere.
    *   Adds a thin layer of abstraction.

### ReadonlyList

A wrapper around an `IList` that provides read-only access to the underlying list.

*   **Definition**: A read-only view specifically for list-like collections, offering index-based access without modification capabilities.
*   **How to use**:
    ```typescript
    import { List, ReadonlyList } from '@mirei/ts-collections';

    const mutableList = new List([10, 20, 30]);
    const readonlyListView = new ReadonlyList(mutableList);

    console.log(readonlyListView.get(1)); // 20
    // readonlyListView.removeAt(0); // Error: Property 'removeAt' does not exist
    ```
*   **Pros**:
    *   Combines the benefits of `ReadonlyCollection` with index-based access specific to lists.
    *   Useful for exposing list data in a controlled manner.
*   **Cons**:
    *   Same limitations as `ReadonlyCollection` regarding underlying mutability.

### ReadonlyDictionary

A wrapper around an `IDictionary` that provides read-only access to the underlying dictionary.

*   **Definition**: A read-only view for dictionary-like collections, allowing key-based lookups but preventing additions, updates, or deletions.
*   **How to use**:
    ```typescript
    import { Dictionary, ReadonlyDictionary } from '@mirei/ts-collections';

    const mutableDict = new Dictionary<string, number>();
    mutableDict.set("a", 1).set("b", 2);
    const readonlyDictView = new ReadonlyDictionary(mutableDict);

    console.log(readonlyDictView.get("a")); // 1
    console.log(readonlyDictView.containsKey("c")); // false
    // readonlyDictView.set("c", 3); // Error: Property 'set' does not exist
    ```
*   **Pros**:
    *   Provides a secure way to share dictionary data without risk of modification.
    *   Maintains the key-value lookup efficiency.
*   **Cons**:
    *   Same limitations as `ReadonlyCollection` regarding underlying mutability.

## Enumerators

Enumerators provide LINQ-like capabilities for querying and manipulating data.

### Enumerable

Provides LINQ-like query capabilities for synchronous collections.

*   **Definition**: A utility class that extends iterable collections with a rich set of functional programming methods for querying, filtering, transforming, and aggregating data.
*   **How to use**:
    ```typescript
    import { Enumerable } from '@mirei/ts-collections';

    const numbers = [1, 2, 3, 4, 5];
    const evenNumbersSquared = Enumerable.from(numbers)
                                         .where(n => n % 2 === 0)
                                         .select(n => n * n)
                                         .toArray(); // [4, 16]
    ```
*   **Pros**:
    *   Powerful and expressive syntax for data manipulation.
    *   Lazy evaluation for many operations, improving performance.
    *   Promotes functional programming style.
*   **Cons**:
    *   Can be less performant than direct loop implementations for very simple operations.
    *   Steeper learning curve for those unfamiliar with LINQ or functional programming.
*   **Standalone Functions**:
    * All methods in the IEnumerable interface have their standalone versions available.
    * See [API](#API) page for full list of functions.
    * Example usage:
    ```typescript
    import { where } from '@mirei/ts-collections';

    const numbers = [1, 2, 3, 4, 5];
    const evenNumbers = where(numbers, n => n % 2 === 0).toArray(); // [2, 4]
    ```

### AsyncEnumerable

Provides LINQ-like query capabilities for asynchronous collections (e.g., `AsyncIterable`).

*   **Definition**: Similar to `Enumerable`, but designed to work with asynchronous data sources, allowing for LINQ-like operations on `AsyncIterable` streams.
*   **How to use**:
    ```typescript
    import { AsyncEnumerable } from '@mirei/ts-collections';

    async function* generateNumbers() {
        for (let i = 1; i <= 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 10));
            yield i;
        }
    }

    async function processAsyncData() {
        const asyncNumbers = AsyncEnumerable.from(generateNumbers());
        const result = await asyncNumbers
                               .where(n => n % 2 !== 0)
                               .select(n => n * 2)
                               .toArray(); // [2, 6, 10]
        console.log(result);
    }
    processAsyncData();
    ```
*   **Pros**:
    *   Enables elegant and declarative manipulation of asynchronous data streams.
    *   Integrates seamlessly with `async/await`.
*   **Cons**:
    *   Adds complexity compared to synchronous enumerables.
    *   Performance can be affected by the asynchronous nature of the underlying data source.

## API

Full API documentation can be found [here](https://phrolovia.github.io/ts-collections/).