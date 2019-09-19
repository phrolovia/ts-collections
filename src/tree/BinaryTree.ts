import { BinaryTreeNode } from "./BinaryTreeNode";

export class BinaryTree<T> {
    private root: BinaryTreeNode<T>;
    public constructor() {
        this.root = null;
    }
    public isEmpty(): boolean {
        return this.root == null;
    }
    public insert(data: T): void {
        this.root = this.insertData(this.root, data);
    }
    private insertData(node: BinaryTreeNode<T>, data: T): BinaryTreeNode<T> {
        if (node == null) {
            node = new BinaryTreeNode<T>(data);
        } else {
            if (node.getRight() == null){
                node.setRight(this.insertData(node.getRight(), data));
            } else {
                node.setLeft(this.insertData(node.getLeft(), data));
            }
        }
        return node;
    }
    public countNodes(): number {
        return this.countTreeNodes(this.root);
    }
    private countTreeNodes(root: BinaryTreeNode<T>): number {
        if (root == null) return 0;
        return 1 + this.countTreeNodes(root.getLeft()) + this.countTreeNodes(root.getRight());
    }
    public search(item: T): boolean {
       return this.searchTree(this.root, item);
    }
    private searchTree(root: BinaryTreeNode<T>, item: T): boolean {
        if (root.getData() === item) return true;
        if (root.getLeft() != null) {
            if (this.searchTree(root.getLeft(),  item)) return true;
        }
        if (root.getRight() != null) {
            if (this.searchTree(root.getRight(), item)) return true;
        }
        return false;
    }
    public inorder(): void {
        this.inorderTraversal(this.root);
    }
    private inorderTraversal(root: BinaryTreeNode<T>): void {
        if (root != null) {
            this.inorderTraversal(root.getLeft());
            console.log("Data: ", root.getData().toString());
            this.inorderTraversal(root.getRight());
        }
    }
    public preorder(): void {
        this.preorderTraversal(this.root);
    }
    private preorderTraversal(root: BinaryTreeNode<T>): void {
        if (root != null) {
            console.log("Data: ", root.getData().toString());
            this.inorderTraversal(root.getLeft());
            this.inorderTraversal(root.getRight());
        }
    }
    public postorder(): void {
        this.postorderTraversal(this.root);
    }
    private postorderTraversal(root: BinaryTreeNode<T>): void {
        if (root != null) {
            this.inorderTraversal(root.getLeft());
            this.inorderTraversal(root.getRight());
            console.log("Data: ", root.getData().toString());
        }
    }
}