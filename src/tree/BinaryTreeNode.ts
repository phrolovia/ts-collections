export class BinaryTreeNode<T extends any> {
    private left: BinaryTreeNode<T>;
    private right: BinaryTreeNode<T>;
    private data: T;
    public constructor(rootData?: T) {
        if (rootData) this.data = rootData;
    }
    public getLeft(): BinaryTreeNode<T> {
        return this.left;
    }
    public getRight(): BinaryTreeNode<T> {
        return this.right;
    }
    public setLeft(node: BinaryTreeNode<T>): void {
        this.left = node;
    }
    public setRight(node: BinaryTreeNode<T>): void {
        this.right = node;
    }
    public setData(data: T): void {
        this.data = data;
    }
    public getData(): T {
        return this.data;
    }
}