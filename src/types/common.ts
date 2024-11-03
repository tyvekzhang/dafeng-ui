export interface BaseModel {
  id: number;
  create_time: Date;
  update_time?: Date;
}

export interface BasePage {
  page: number;
  size: number;
  count?: boolean;
}
