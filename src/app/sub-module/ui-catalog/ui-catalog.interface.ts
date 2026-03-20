import { NamedId } from '../../model/named-id';

export enum PresentationalComponentType {
  UI,
  Feature,
}

export interface UiCatalogItemData extends NamedId {
  type: PresentationalComponentType;
}
