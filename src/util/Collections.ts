import {ICollection} from "../core/ICollection";
import {IList} from "../list/IList";

export abstract class Collections {
    public static addAll<T>(collection: ICollection<T>, ...items: T[]): void {
        if (!collection) {
            throw new Error("Collection is null.");
        }
        items.forEach(item => collection.add(item));
    }
    public static disjoint<T>(c1: ICollection<T>, c2: ICollection<T>): boolean {
        if (!c1) {
            throw new Error("c1 is null.");
        }
        if (!c2) {
            throw new Error("c2 is null.");
        }
        for (const item1 of c1) {
            if (c2.contains(item1)) {
                return false;
            }
        }
        return true;
    }
    public static fill<T>(list: IList<T>, item: T): void {
        if (!list) {
            throw new Error("list is null.");
        }
        for (let ix = 0; ix < list.Count; ++ix) {
            list.set(ix, item);
        }
    }
    public static reverse<T>(list: IList<T>): void {
        if (!list || list.Count <= 1) {
            return;
        }
        const value: T = list.get(0);
        list.removeAt(0);
        Collections.reverse(list);
        list.add(value);
    }
    public static shuffle<T>(list: IList<T>): void {
        let rx = 0;
        let temp: T = null;
        for (let ix = list.Count - 1; ix > 0; ix--) {
            rx = Math.floor(Math.random() * (ix+1));
            temp = list.get(ix);
            list.set(ix, list.get(rx));
            list.set(rx, temp);
        }
    }
}
