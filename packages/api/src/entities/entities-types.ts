export type StatusType = "trash" | "draft" | "published" | "archived";

export interface IStatusEntity {
  id?: string;
  name: StatusType;
}

export interface IProductEntity {
  id?: string;
  name: string;
  price: number;
  quantity: string;
  brands: string;
  categories: string;
  labels: string;
  cities: string;
  purchasePlaces: string;
  stores: string;
  ingredientsText: string;
  traces: string;
  servingSize: string;
  servingQuantity: number;
  nutriscoreScore: number;
  nutriscoreQrade: string;
  mainCategory: string;
  imageUrl: string;
}
