import { INode } from "./INode";
export declare class TreeNode<T> implements INode<T> {
    private data;
    private left;
    private right;
    constructor(data: T);
    getData(): T;
    getLeft(): INode<T>;
    getRight(): INode<T>;
    setData(data: T): void;
    setLeft(node: INode<T>): void;
    setRight(node: INode<T>): void;
}
