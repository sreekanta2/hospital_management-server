import { SortOrder } from "mongoose";

interface IOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
interface IOptionsReturn {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
}

export const paginationCalculator = (options: IOptions): IOptionsReturn => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 8;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
