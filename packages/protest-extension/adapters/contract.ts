export interface IElement {
  id: string;
  domNode: Element;
  hidden: boolean;
  fetched: boolean;
}

export interface IAdapter {
  collect: () => IElement[];
  hide: (element: IElement) => void;
}
