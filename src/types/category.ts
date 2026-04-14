import { TCategory } from './generated/ctp';

type PickedCategory = Pick<TCategory, 'key' | 'name'>;

export type Category = PickedCategory & {
  facetAttributeKeys?: string[];
  parent?: PickedCategory;
};
