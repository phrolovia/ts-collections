A simple library for providing wrapper classes for collection objects.

## List of Classes
* List
* Queue, Deque
* Set (TreeSet)
* Tree (BinaryTree and BinarySearchTree)

## Usage
```typescript
const list: IList<number> = new List<number>();
list.add(1);

const queue: IQueue<number> = new List<number>();
queue.enqueue(1);

const deque: IDeque<number> = new List<number>();
deque.enqueue(2);
deque.enqueueFirst(1);
```

## Comparators
For trees, you need to provide your own comparator while creating the instances of these classes
```typescript
const comparator: (v1: string, v2: string) => v1.localeCompare(v2);
const tree: ITree<string> = new BinaryTree<string>(comparator);
```

## Documentation & API
A simple documentation can be found at:
https://ninohane.github.io/ts-collections/