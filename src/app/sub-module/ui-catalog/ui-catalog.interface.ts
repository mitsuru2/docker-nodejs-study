import { NamedIdData } from '../../model/named-id';

export enum PresentationalComponentType {
  UI,
  Feature,
}

export interface UiCatalogItemData extends NamedIdData {
  type: PresentationalComponentType;
}
