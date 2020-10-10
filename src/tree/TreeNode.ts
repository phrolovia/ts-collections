import { INode } from "./INode";

export class TreeNode<TElement> implements INode<TElement> {
    private data: TElement;
    private left: INode<TElement>;
    private right: INode<TElement>;
    public constructor(data: TElement) {
        this.data = data;
    }
    public getData(): TElement {
        return this.data;
    }
    public getLeft(): INode<TElement> {
        return this.left;
    }
    public getRight(): INode<TElement> {
        return this.right;
    }
    public setData(data: TElement): void {
        this.data = data;
    }
    public setLeft(node: INode<TElement>): void {
        this.left = node;
    }
    public setRight(node: INode<TElement>): void {
        this.right = node;
    }
}
