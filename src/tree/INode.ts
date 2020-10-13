export interface INode<TElement> {
    getData(): TElement;
    getLeft(): INode<TElement>;
    getRight(): INode<TElement>;
    setData(data: TElement): void;
    setLeft(node: INode<TElement>): void;
    setRight(node: INode<TElement>): void;
}
