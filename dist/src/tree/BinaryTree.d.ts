export declare class BinaryTree<T> {
    private root;
    constructor();
    isEmpty(): boolean;
    insert(data: T): void;
    private insertData;
    countNodes(): number;
    private countTreeNodes;
    search(item: T): boolean;
    private searchTree;
    inorder(): void;
    private inorderTraversal;
    preorder(): void;
    private preorderTraversal;
    postorder(): void;
    private postorderTraversal;
}
