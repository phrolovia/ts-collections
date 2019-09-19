export declare class BinaryTreeNode<T extends any> {
    private left;
    private right;
    private data;
    constructor(rootData?: T);
    getLeft(): BinaryTreeNode<T>;
    getRight(): BinaryTreeNode<T>;
    setLeft(node: BinaryTreeNode<T>): void;
    setRight(node: BinaryTreeNode<T>): void;
    setData(data: T): void;
    getData(): T;
}
