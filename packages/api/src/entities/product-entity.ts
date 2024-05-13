import { BaseEntity } from "./base-entity";
import { type IProductEntity } from "./entities-types";

export class ProductEntity extends BaseEntity {
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

  protected constructor(props: IProductEntity) {
    super(props.id, "pro");
    this.name = props.name;
    this.price = props.price;
    this.quantity = props.quantity;
    this.brands = props.brands;
    this.categories = props.categories;
    this.labels = props.labels;
    this.cities = props.cities;
    this.purchasePlaces = props.purchasePlaces;
    this.stores = props.stores;
    this.ingredientsText = props.ingredientsText;
    this.traces = props.traces;
    this.servingSize = props.servingSize;
    this.servingQuantity = props.servingQuantity;
    this.nutriscoreScore = props.nutriscoreScore;
    this.nutriscoreQrade = props.nutriscoreQrade;
    this.mainCategory = props.mainCategory;
    this.imageUrl = props.imageUrl;
  }

  static create(props: IProductEntity): ProductEntity {
    return new ProductEntity(props);
  }
}
