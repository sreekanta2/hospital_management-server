import { Response } from "express";

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  const responseData = {
    statusCode: data?.statusCode,
    success: data?.success,
    message: data?.message || null,
    meta: data?.meta || null || undefined,
    data: data?.data || null || undefined,
  };
  return res.status(data.statusCode).json(responseData);
};
