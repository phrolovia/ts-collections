Just a simple library for providing wrapper classes.

## List of Classes
* List
* Queue
* Stack
* Set (TreeSet)
* Tree (BinaryTree and BinarySearchTree)

## Usage
```typescript
const list: IList<number> = new List<number>();
list.add(1);
```

## Comparators
For trees, you need to provide your own comparator while creating instances of these classes
```typescript
const comparator: (v1: string, v2: string) => v1.localeCompare(v2);
const tree: ITree<string> = new BinaryTree<string>(comparator);
```