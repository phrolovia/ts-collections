A simple collections library for TypeScript.

## List
### Usage

```typescript
const list = new List<string>();
```

You can pass an Iterable object to the constructor.

````typescript
const array = [1, 2, 3, 4, 5];
const list = new List(array);
````

You can also pass an equality comparator that will be used instead of default equality comparator.
You should always define this custom equality comparator if your List contains complex objects.

````typescript
const person1 = new Person("John", "Doe", 21);
const person2 = new Person("John", "Doe", 55);
const comparator: EqualityComparator = (p1, p2) => p1.name === p2.name && p1.surname == p2.surname && p1.age == p2.age;
const list = new List([person1, person2], comparator);
````
---

## LinkedList
### Usage

```typescript
const list = new LinkedList<string>();
```

You can pass an Iterable object to the constructor.

````typescript
const array = [1, 2, 3, 4, 5];
const list = new LinkedList(array);
````

You can also pass an equality comparator that will be used instead of default equality comparator.
You should always define this custom equality comparator if your LinkedList contains complex objects.

````typescript
const person1 = new Person("John", "Doe", 21);
const person2 = new Person("John", "Doe", 55);
const comparator: EqualityComparator = (p1, p2) => p1.name === p2.name && p1.surname == p2.surname && p1.age == p2.age;
const list = new LinkedList([person1, person2], comparator);
````
---

## RedBlackTree
### Usage

```typescript
const tree = new RedBlackTree<string>();
```

You can pass an Iterable object to the constructor.

````typescript
const array = [1, 2, 3, 4, 5];
const tree = new RedBlackTree(array);
````

You can also pass an order comparator that will be used instead of default order comparator.
You should always define this custom order comparator if your RedBlackTree contains complex objects.

````typescript
const person1 = new Person("John", "Doe", 21);
const person2 = new Person("John", "Doe", 55);
const comparator: OrderComparator = (p1, p2) => p1.name.localeCompare(p2.name);
const tree = new RedBlackTree(comparator, [person1, person2]);
````
---

## TreeSet
### Usage

```typescript
const treeSet = new TreeSet<string>();
```

You can pass an Iterable object to the constructor.

````typescript
const array = [1, 2, 3, 4, 5];
const treeSet = new TreeSet(array);
````

You can also pass an order comparator that will be used instead of default order comparator.
You should always define this custom order comparator if your TreeSet contains complex objects.

````typescript
const person1 = new Person("John", "Doe", 21);
const person2 = new Person("John", "Doe", 55);
const comparator: OrderComparator = (p1, p2) => p1.name.localeCompare(p2.name);
const treeSet = new TreeSet([person1, person2], comparator);
````
---

## Dictionary

Dictionary is implemented as a sorted dictionary by using RedBlackTree internally.

### Usage

````typescript
const dictionary = new Dictionary<number, Person>();
````

You can pass an Iterable<KeyValuePair<TKey, TValue>> object to the constructor.

````typescript
const array: KeyValuePair<number, string> = [
    new KeyValuePair(1, "a"),
    new KeyValuePair(2, "b")
]
const dictionary = new Dictionary(null, null, array);
````

You can also pass an order comparator, and an equality comparator that will be used instead of default order and equality comparators.
You should always define these custom comparators if your dictionary contains complex objects.

Dictionary has two comparators.
- keyComparator: This is an order comparator and used to sort dictionary. It should always be provided if the key is a complex object.
- valueComparator: This is an equality comparator and used to check the equality of values. It should always be provided if the value is a complex object.

You can pass null to use default comparators. However, it will not work properly when the objects are complex.

````typescript
const personOrderComparator: OrderComparator = (p1: Person, p2: Person) => p1.name.localeCompare(p2.name);
const personEqualityComparator: EqualityComparator = (p1, p2) => p1.name === p2.name && p1.surname == p2.surname && p1.age == p2.age;
const dictionary1 = new Dictionary<Person, string>(personOrderComparator);
const dictionary2 = new Dictionary<string, Person>(null, personEqualityComparator);
````

---

## IQueue and IDeque interfaces
Both of these interfaces are implemented in LinkedList class.

### Usage
````typescript
const queue: IQueue<string> = new LinkedList<string>();
const deque: IDeque<string> = new LinkedList<string>();
````

---

## Enumerable Support
All the provided classes in the library has integrated enumerable support.

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

## Documentation & API
A simple documentation can be found at:
https://discordelia.github.io/ts-collections/
