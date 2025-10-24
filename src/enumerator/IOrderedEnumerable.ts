import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";
import { IEnumerable } from "./IEnumerable";

export interface IOrderedEnumerable<TElement> extends IEnumerable<TElement> {

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * This method must be called on an IOrderedEnumerable (the result of orderBy, orderByDescending, thenBy, or thenByDescending).
     * Calling orderBy or orderByDescending after this method will override the entire sorting sequence.
     * @template TKey The type of the key returned by keySelector.
     * @param keySelector The function to extract the key for secondary sorting from an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default ascending order comparison will be used.
     * @returns {IOrderedEnumerable<TElement>} An IOrderedEnumerable whose elements are sorted by the primary condition and then by this secondary condition (ascending).
     * @example
     *      interface Person { name: string; city: string; age: number; }
     *      const people = new List<Person>([
     *          { name: 'Alice', city: 'London', age: 30 },
     *          { name: 'Bob', city: 'Paris', age: 25 },
     *          { name: 'Charlie', city: 'London', age: 35 },
     *          { name: 'Diana', city: 'Paris', age: 30 }
     *      ]);
     *
     *      // --- Standard Usage ---
     *      // Order by city ascending (primary), then by age ascending (secondary)
     *      const sortedPeople = people
     *          .orderBy(p => p.city) // Primary sort: city ascending
     *          .thenBy(p => p.age)      // Secondary sort: age ascending
     *          .toArray();
     *      // sortedPeople = [
     *      //   { name: 'Alice', city: 'London', age: 30 },
     *      //   { name: 'Charlie', city: 'London', age: 35 },
     *      //   { name: 'Bob', city: 'Paris', age: 25 },
     *      //   { name: 'Diana', city: 'Paris', age: 30 }
     *      // ]
     *
     *      // --- Overriding Behavior ---
     *      // Order by city, then by age, but then override with a new primary order by name
     *      const overriddenSort = people
     *          .orderBy(p => p.city)
     *          .thenBy(p => p.age)
     *          .orderBy(p => p.name) // This orderBy overrides the previous sorts
     *          .toArray();
     *      // The final sort is based only on name ascending:
     *      // overriddenSort = [
     *      //   { name: 'Alice', city: 'London', age: 30 },
     *      //   { name: 'Bob', city: 'Paris', age: 25 },
     *      //   { name: 'Charlie', city: 'London', age: 35 },
     *      //   { name: 'Diana', city: 'Paris', age: 30 }
     *      // ]
     */
    thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * This method must be called on an IOrderedEnumerable (the result of orderBy, orderByDescending, thenBy, or thenByDescending).
     * Calling orderBy or orderByDescending after this method will override the entire sorting sequence.
     * @template TKey The type of the key returned by keySelector.
     * @param keySelector The function to extract the key for secondary sorting from an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default descending order comparison will be used.
     * @returns {IOrderedEnumerable<TElement>} An IOrderedEnumerable whose elements are sorted by the primary condition and then by this secondary condition (descending).
     * @example
     *      interface Person { name: string; city: string; age: number; }
     *      const people = new List<Person>([
     *          { name: 'Alice', city: 'London', age: 30 },
     *          { name: 'Bob', city: 'Paris', age: 25 },
     *          { name: 'Charlie', city: 'London', age: 35 },
     *          { name: 'Diana', city: 'Paris', age: 30 }
     *      ]);
     *
     *      // --- Standard Usage ---
     *      // Order by city ascending (primary), then by age descending (secondary)
     *      const sortedPeople = people
     *          .orderBy(p => p.city)          // Primary sort: city ascending
     *          .thenByDescending(p => p.age) // Secondary sort: age descending
     *          .toArray();
     *      // sortedPeople = [
     *      //   { name: 'Charlie', city: 'London', age: 35 },
     *      //   { name: 'Alice', city: 'London', age: 30 },
     *      //   { name: 'Diana', city: 'Paris', age: 30 },
     *      //   { name: 'Bob', city: 'Paris', age: 25 }
     *      // ]
     *
     *      // --- Overriding Behavior ---
     *      // Order by city, then by age descending, but then override with order by name descending
     *      const overriddenSort = people
     *          .orderBy(p => p.city)
     *          .thenByDescending(p => p.age)
     *          .orderByDescending(p => p.name) // This overrides the previous sorts
     *          .toArray();
     *      // The final sort is based only on name descending:
     *      // overriddenSort = [
     *      //   { name: 'Diana', city: 'Paris', age: 30 },
     *      //   { name: 'Charlie', city: 'London', age: 35 },
     *      //   { name: 'Bob', city: 'Paris', age: 25 },
     *      //   { name: 'Alice', city: 'London', age: 30 }
     *      // ]
     */
    thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;
}
