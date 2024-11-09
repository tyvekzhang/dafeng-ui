export interface ModelBase {
  id: number;
  create_time: Date;
  update_time?: Date;
}

export interface PageBase {
  page: number;
  size: number;
  count?: boolean;
}
