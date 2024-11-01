export interface baseModel {
  id: number;
  create_time: Date;
  update_time?: Date;
}

export interface TableParams {
  page: number;
  size: number;
}
