// Common type definitions for the analytics dashboard

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DateRange {
  startDate: Date | string
  endDate: Date | string
}

export interface ChartDataPoint {
  name: string
  value: number
  label?: string
  color?: string
}

export interface TimeSeriesDataPoint {
  timestamp: Date | string
  value: number
  label?: string
}

export interface Metric {
  id: string
  name: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  unit?: string
  description?: string
}

export interface Filter {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: any
}

export interface SortOption {
  field: string
  order: 'asc' | 'desc'
}

export interface QueryParams {
  page?: number
  pageSize?: number
  filters?: Filter[]
  sort?: SortOption
  search?: string
  dateRange?: DateRange
}