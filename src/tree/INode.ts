export interface INode<T> {
    getData(): T;
    getLeft(): INode<T>;
    getRight(): INode<T>;
    setData(data: T): void;
    setLeft(node: INode<T>): void;
    setRight(node: INode<T>): void;
}