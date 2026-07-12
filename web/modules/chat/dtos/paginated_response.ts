export interface GetPaginatedResponse<T> {
    items: T[],
    page: number,
    page_size: number,
    total: number,
    total_pages: number,
    has_previous: boolean
}