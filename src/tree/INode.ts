export interface INode<TElement> {
    getData(): TElement;

    getLeft(): INode<TElement> | null;

    getRight(): INode<TElement> | null;

    setData(data: TElement): void;

    setLeft(node: INode<TElement>): void;

    setRight(node: INode<TElement>): void;
}
