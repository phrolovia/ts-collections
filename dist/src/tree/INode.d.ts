export interface INode<T> {
    getData(): T;
    getLeft(): INode<T>;
    getRight(): INode<T>;
    setLeft(node: INode<T>): void;
    setRight(node: INode<T>): void;
}
