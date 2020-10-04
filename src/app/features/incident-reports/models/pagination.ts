export class Pagination {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}

export class PaginationResult<T> {
  data: T[];
  paging: Pagination;
}
