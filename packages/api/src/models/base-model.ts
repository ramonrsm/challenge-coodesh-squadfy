export abstract class BaseModel {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  protected constructor(id?: string) {
    this.id = id;
  }
}
