import type { INode } from "./INode";

export class TreeNode<TElement> implements INode<TElement> {
    private data: TElement;
    private left: INode<TElement> | null = null;
    private right: INode<TElement> | null = null;

    public constructor(data: TElement) {
        this.data = data;
    }

    public getData(): TElement {
        return this.data;
    }

    public getLeft(): INode<TElement> | null {
        return this.left;
    }

    public getRight(): INode<TElement> | null {
        return this.right;
    }

    public setData(data: TElement): void {
        this.data = data;
    }

    public setLeft(node: INode<TElement> | null): void {
        this.left = node;
    }

    public setRight(node: INode<TElement> | null): void {
        this.right = node;
    }
}
