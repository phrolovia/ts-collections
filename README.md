# ts-collections

A TypeScript library providing a comprehensive set of data structures with a focus on type safety and performance.

## Table of Contents
- [Installation](#installation)
- [Data Structures](#data-structures)
  - [List](#list)
    - [List](#list-1)
    - [LinkedList](#linkedlist)
  - [Dictionary](#dictionary)
    - [Dictionary](#dictionary-1)
    - [SortedDictionary](#sorteddictionary)
  - [Set](#set)
    - [EnumerableSet](#enumerableset)
    - [SortedSet](#sortedset)
  - [Queue](#queue)
    - [Queue](#queue-1)
    - [CircularQueue](#circularqueue)
    - [PriorityQueue](#priorityqueue)
  - [Stack](#stack)
    - [Stack](#stack-1)
  - [Heap](#heap)
    - [Heap](#heap-1)
  - [Tree](#tree)
    - [RedBlackTree](#redblacktree)
  - [Lookup](#lookup)
    - [Lookup](#lookup-1)
  - [Immutable Data Structures](#immutable-data-structures)
    - [ImmutableList](#immutablelist)
    - [ImmutableDictionary](#immutabledictionary)
    - [ImmutableSortedDictionary](#immutablesorteddictionary)
    - [ImmutableSet](#immutableset)
    - [ImmutableSortedSet](#immutablesortedset)
    - [ImmutableQueue](#immutablequeue)
    - [ImmutableStack](#immutablestack)
- [Enumerable Support](#enumerable-support)

## Installation

```shell
npm i @mirei/ts-collections
```

## Data Structures

### List

Lists are ordered collections that allow duplicate elements and provide index-based access.

#### List

A dynamic array-based implementation of a list.

- **When to use**: When you need fast random access by index and efficient operations at the end of the collection.
- **Key features**:
  - Fast random access by index (O(1))
  - Efficient add/remove at the end (O(1) amortized)
  - Less efficient add/remove at arbitrary positions (O(n))
- **Example usage**:

```typescript
const list = new List([1, 2, 3, 4, 5]);
list.add(6);                // Add element at the end
list.addAt(0, 0);           // Add element at specific index
list.get(3);                // Get element at index 3
list.removeAt(0);           // Remove element at index 0
list.sort();                // Sort the list
```

#### LinkedList

A doubly-linked list implementation.

- **When to use**: When you need efficient insertions and deletions at both ends or in the middle of the list.
- **Key features**:
  - O(1) operations at both ends (add, remove)
  - O(1) insertion/deletion after finding a position
  - O(n) random access by index
  - Supports queue and stack operations (addFirst, addLast, removeFirst, removeLast)
- **Example usage**:

```typescript
const linkedList = new LinkedList([1, 2, 3]);
linkedList.addFirst(0);     // Add at beginning
linkedList.addLast(4);      // Add at end
linkedList.removeFirst();   // Remove from beginning
linkedList.removeLast();    // Remove from end
```

### Dictionary

Dictionaries are collections of key-value pairs where each key is unique.

#### Dictionary

A hash-based implementation of a dictionary using JavaScript's Map.

- **When to use**: When you need fast lookups by key and don't need the keys to be ordered.
- **Key features**:
  - Fast lookups, insertions, and deletions (O(1) average)
  - Keys are not ordered
  - Supports custom equality comparators
- **Example usage**:

```typescript
const dict = new Dictionary<string, number>();
dict.add("one", 1);         // Add a key-value pair
dict.put("two", 2);         // Add or update a key-value pair
dict.get("one");            // Get value by key
dict.remove("one");         // Remove a key-value pair
dict.containsKey("two");    // Check if key exists
```

#### SortedDictionary

A dictionary implementation that keeps keys sorted using a Red-Black Tree.

- **When to use**: When you need a dictionary with keys maintained in sorted order.
- **Key features**:
  - Guaranteed O(log n) lookups, insertions, and deletions
  - Keys are always sorted
  - Supports custom key comparators
- **Example usage**:

```typescript
const sortedDict = new SortedDictionary<number, string>();
sortedDict.add(3, "three");
sortedDict.add(1, "one");
sortedDict.add(2, "two");
// Iteration will be in order: 1, 2, 3
for (const pair of sortedDict) {
    console.log(pair.key, pair.value);
}
```

### Set

Sets are collections of unique elements.

#### EnumerableSet

A set implementation based on JavaScript's Set.

- **When to use**: When you need a collection of unique elements with fast lookups.
- **Key features**:
  - Fast lookups, insertions, and deletions (O(1) average)
  - Elements are not ordered
  - Supports set operations (union, intersection, difference)
- **Example usage**:

```typescript
const set = new EnumerableSet([1, 2, 3]);
set.add(4);                 // Add an element
set.contains(2);            // Check if element exists
set.remove(1);              // Remove an element
set.intersectWith([2, 3, 5]); // Keep only elements that are in both sets
```

#### SortedSet

A set implementation that keeps elements sorted using a Red-Black Tree.

- **When to use**: When you need a set with elements maintained in sorted order.
- **Key features**:
  - Guaranteed O(log n) lookups, insertions, and deletions
  - Elements are always sorted
  - Supports custom element comparators
  - Supports range operations (headSet, tailSet, subSet)
- **Example usage**:

```typescript
const sortedSet = new SortedSet([3, 1, 4, 2]);
// Iteration will be in order: 1, 2, 3, 4
for (const element of sortedSet) {
    console.log(element);
}
// Get subsets
const headSet = sortedSet.headSet(3);  // Elements less than 3
const tailSet = sortedSet.tailSet(2);  // Elements greater than or equal to 2
```

### Queue

Queues are FIFO (First-In-First-Out) collections.

#### Queue

A standard queue implementation using a LinkedList.

- **When to use**: When you need a FIFO data structure.
- **Key features**:
  - O(1) operations at both ends (enqueue, dequeue)
  - Supports peeking at the front element without removing it
- **Example usage**:

```typescript
const queue = new Queue([1, 2, 3]);
queue.enqueue(4);           // Add to the end
const front = queue.peek(); // Look at the front element
const item = queue.dequeue(); // Remove and return the front element
```

#### CircularQueue

A fixed-size queue that overwrites the oldest elements when full.

- **When to use**: When you need a queue with a fixed capacity that automatically removes old elements.
- **Key features**:
  - Fixed capacity (default 32)
  - Automatically removes oldest elements when full
  - O(1) operations at both ends
- **Example usage**:

```typescript
const circularQueue = new CircularQueue<number>(5); // Capacity of 5
for (let i = 0; i < 10; i++) {
    circularQueue.enqueue(i);
}
// Queue will contain only the 5 most recent elements: 5, 6, 7, 8, 9
```

#### PriorityQueue

A queue where elements are dequeued according to priority.

- **When to use**: When you need to process elements in order of priority rather than insertion order.
- **Key features**:
  - O(log n) insertion and removal
  - Highest priority element is always at the front
  - Supports custom priority comparators
- **Example usage**:

```typescript
// Min priority queue (smallest element first)
const priorityQueue = new PriorityQueue<number>([3, 1, 4, 2]);
priorityQueue.enqueue(5);
// Elements will be dequeued in order: 1, 2, 3, 4, 5
```

### Stack

Stacks are LIFO (Last-In-First-Out) collections.

#### Stack

A standard stack implementation using a LinkedList.

- **When to use**: When you need a LIFO data structure.
- **Key features**:
  - O(1) operations at the top (push, pop)
  - Supports peeking at the top element without removing it
- **Example usage**:

```typescript
const stack = new Stack([1, 2, 3]);
stack.push(4);              // Add to the top
const top = stack.peek();   // Look at the top element
const item = stack.pop();   // Remove and return the top element
```

### Heap

A binary heap is a complete binary tree where each node's value is greater than or equal to (max heap) or less than or equal to (min heap) the values of its children.

#### Heap

A binary heap implementation.

- **When to use**: When you need to efficiently find and remove the minimum or maximum element.
- **Key features**:
  - O(1) access to the minimum/maximum element
  - O(log n) insertion and removal
  - Supports custom comparators to create min or max heaps
- **Example usage**:

```typescript
// Min heap (smallest element at the root)
const minHeap = new Heap<number>((a, b) => a - b);
minHeap.add(3);
minHeap.add(1);
minHeap.add(4);
const min = minHeap.peek(); // Get the minimum element (1)
minHeap.poll();             // Remove and return the minimum element
```

### Tree

Trees are hierarchical data structures.

#### RedBlackTree

A self-balancing binary search tree implementation.

- **When to use**: When you need a balanced tree for efficient lookups, insertions, and deletions.
- **Key features**:
  - Guaranteed O(log n) lookups, insertions, and deletions
  - Elements are always sorted
  - Supports custom element comparators
- **Example usage**:

```typescript
const tree = new RedBlackTree<number>();
tree.insert(3);
tree.insert(1);
tree.insert(4);
tree.search(1);             // Check if element exists
tree.delete(3);             // Remove an element
```

### Lookup

A lookup is a collection that maps keys to collections of values.

#### Lookup

A lookup implementation using a RedBlackTree.

- **When to use**: When you need to group elements by a key and access all elements with a specific key.
- **Key features**:
  - O(log n) lookups by key
  - Each key maps to a collection of values
  - Supports custom key comparators
- **Example usage**:

```typescript
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
const categoryA = lookup.get("A"); // Returns collection with values 1 and 3
```

### Immutable Data Structures

Immutable data structures are collections that cannot be modified after they are created. Any operation that would modify the structure instead returns a new instance with the modification applied, leaving the original structure unchanged.

#### ImmutableList

An immutable version of List.

- **When to use**: When you need a list that cannot be modified, or when you want to ensure that a list passed to a function is not modified.
- **Key features**:
  - All operations that would modify the list return a new list
  - Supports all standard list operations
- **Example usage**:

```typescript
const list = ImmutableList.create([1, 2, 3]);
const newList = list.add(4);      // Original list is unchanged
const filtered = list.removeIf(x => x % 2 === 0); // Returns new list with odd numbers only
```

#### ImmutableDictionary

An immutable version of Dictionary.

- **When to use**: When you need a dictionary that cannot be modified, or when you want to ensure that a dictionary passed to a function is not modified.
- **Key features**:
  - All operations that would modify the dictionary return a new dictionary
  - Supports all standard dictionary operations
- **Example usage**:

```typescript
const dict = ImmutableDictionary.create<string, number>();
const dict2 = dict.add("one", 1);  // Original dictionary is unchanged
const dict3 = dict2.put("two", 2); // Returns new dictionary with the added key-value pair
```

#### ImmutableSortedDictionary

An immutable version of SortedDictionary.

- **When to use**: When you need a sorted dictionary that cannot be modified.
- **Key features**:
  - All operations that would modify the dictionary return a new dictionary
  - Keys are always sorted
- **Example usage**:

```typescript
const sortedDict = ImmutableSortedDictionary.create<number, string>();
const dict2 = sortedDict.add(3, "three");
const dict3 = dict2.add(1, "one");
// Iteration will be in order: 1, 3
```

#### ImmutableSet

An immutable version of EnumerableSet.

- **When to use**: When you need a set that cannot be modified.
- **Key features**:
  - All operations that would modify the set return a new set
  - Supports all standard set operations
- **Example usage**:

```typescript
const set = ImmutableSet.create([1, 2, 3]);
const set2 = set.add(4);          // Original set is unchanged
const set3 = set2.remove(1);      // Returns new set without the element 1
```

#### ImmutableSortedSet

An immutable version of SortedSet.

- **When to use**: When you need a sorted set that cannot be modified.
- **Key features**:
  - All operations that would modify the set return a new set
  - Elements are always sorted
- **Example usage**:

```typescript
const sortedSet = ImmutableSortedSet.create([3, 1, 4, 2]);
const set2 = sortedSet.add(5);    // Original set is unchanged
// Iteration will be in order: 1, 2, 3, 4, 5
```

#### ImmutableQueue

An immutable version of Queue.

- **When to use**: When you need a queue that cannot be modified.
- **Key features**:
  - All operations that would modify the queue return a new queue
  - Supports all standard queue operations
- **Example usage**:

```typescript
const queue = ImmutableQueue.create([1, 2, 3]);
const queue2 = queue.add(4);      // Original queue is unchanged
// Elements will be dequeued in order: 1, 2, 3, 4
```

#### ImmutableStack

An immutable version of Stack.

- **When to use**: When you need a stack that cannot be modified.
- **Key features**:
  - All operations that would modify the stack return a new stack
  - Supports all standard stack operations
- **Example usage**:

```typescript
const stack = ImmutableStack.create([1, 2, 3]);
const stack2 = stack.add(4);      // Original stack is unchanged
// Elements will be popped in order: 4, 3, 2, 1
```

## Enumerable Support

All collections in this library implement the `IEnumerable` interface, providing LINQ-like operations for querying and manipulating data.

### Example Usage

```typescript
const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const list2 = list.select(n => n * n)
                  .takeWhile(n => n <= 25)
                  .skipWhile(n => n < 10)
                  .orderByDescending(n => n)
                  .toList();
const array = list.takeLast(5).toArray();
```

You can also use Enumerable with plain arrays.

```typescript
const array = Enumerable.from([1, 2, 3, 4, 5])
                        .where(n => n % 2 !== 0)
                        .toArray();
```
