export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCase1Data {
  sectionTitle: string;
  /** 默认展开的第几项，对应 `item-{index}` */
  defaultOpenItemIndex?: number;
  items: FaqItem[];
}
