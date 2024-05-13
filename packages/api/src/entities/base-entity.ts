import crypto from "node:crypto";

export abstract class BaseEntity {
  id?: string;
  prefix?: string = "";

  constructor(id?: string, prefix?: string) {
    this.id = id ?? this.generateId();
    this.prefix = prefix?.concat("_");
  }

  protected generateId() {
    return `${this.prefix}${crypto.randomUUID()}`;
  }
}
