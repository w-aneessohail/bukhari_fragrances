export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;

  constructor(params: { success: boolean; message: string; data?: T; pagination?: PaginationMeta }) {
    this.success = params.success;
    this.message = params.message;
    this.data = params.data;
    this.pagination = params.pagination;
  }
}
