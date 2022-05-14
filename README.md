A simple TypeScript library for basic data structures.

## Installation

````shell
npm i @mirei/ts-collections
````

## Available Collections
* List
  * List
  * LinkedList
* SortedSet
* Dictionary
  * Dictionary
  * SortedDictionary
* Queue
* Stack
* Lookup
* EnumerableArray (list with index access)
* Tree
  * RedBlackTree

_**To be updated with details...**_

## Enumerable Support

### Example Usage

````typescript
const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const list2 = list.select(n => n * n).takeWhile(n <= 25).skipWhile(n < 10).orderByDescending(n => n).toList();
const array = list.takeLast(5).toArray();
````

You can also use Enumerable with plain arrays.

````typescript
const array = Enumerable.from([1, 2, 3, 4, 5]).where(n => n % 2 !== 0).toArray();
````
