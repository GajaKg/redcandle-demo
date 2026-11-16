export interface PagedResponse<T> {
  items: T,
  currentPage: number,
  totalPages: number,
  pageSize: number,
  totalCount: number,
}

export interface Response<T> {
  error: string,
  isSuccess: boolean,
  value: PagedResponse<T>
}

export interface QueryParams {
  currentPage: number,
  pageSize: number
}
