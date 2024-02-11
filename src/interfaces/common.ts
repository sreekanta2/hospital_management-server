import { SortOrder } from "mongoose";

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
export interface IFilterableFields {
  searchTerm?: string;
}
