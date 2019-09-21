import { INode } from "./INode";

export class TreeNode<T> implements INode<T> {
    private data: T;
    private left: INode<T>;
    private right: INode<T>;
    public constructor(data?: T) {
        this.data = data || null;
    }
    public getData(): T {
        return this.data;
    }
    public getLeft(): INode<T> {
        return this.left;
    }
    public getRight(): INode<T> {
        return this.right;
    }
    public setData(data: T): void {
        this.data = data;
    }
    public setLeft(node: INode<T>): void {
        this.left = node;
    }
    public setRight(node: INode<T>): void {
        this.right = node;
    }
}