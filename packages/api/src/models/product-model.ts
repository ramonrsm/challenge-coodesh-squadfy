import { BaseModel } from "./base-model";
import { type IProductModel } from "./models-types";

export class ProductModel extends BaseModel {
  name: string;
  price: number;
  quantity: string;
  brands: string;
  categories: string;
  labels: string;
  cities: string;
  purchase_places: string;
  stores: string;
  ingredients_text: string;
  traces: string;
  serving_size: string;
  serving_quantity: number;
  nutriscore_score: number;
  nutriscore_grade: string;
  main_category: string;
  image_url: string;

  constructor(props: IProductModel) {
    super(props.id);

    this.name = props.name;
    this.price = props.price;
    this.quantity = props.quantity;
    this.brands = props.brands;
    this.categories = props.categories;
    this.labels = props.labels;
    this.cities = props.cities;
    this.purchase_places = props.purchase_places;
    this.stores = props.stores;
    this.ingredients_text = props.ingredients_text;
    this.traces = props.traces;
    this.serving_size = props.serving_size;
    this.serving_quantity = props.serving_quantity;
    this.nutriscore_score = props.nutriscore_score;
    this.nutriscore_grade = props.nutriscore_grade;
    this.main_category = props.main_category;
    this.image_url = props.image_url;
  }
}
