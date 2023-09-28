export interface Page<T> {
  total: number
  collection: T[]
  page: number
  page_size: number
}
