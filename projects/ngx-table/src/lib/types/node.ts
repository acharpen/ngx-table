export type Node<T> = {
  id: number;
  initialPos: number;
  isMatching: boolean;
  isSelected: boolean;
  value: T;
};
