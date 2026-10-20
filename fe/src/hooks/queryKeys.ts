export const queryKeys = {
  categories: {
    all: ['categories'] as const,
    active: ['categories', 'active'] as const,
    detail: (id: string) => ['categories', id] as const,
  },
  products: {
    all: ['products'] as const,
    available: ['products', 'available'] as const,
    byCategory: (categoryId: string) => ['products', 'category', categoryId] as const,
    detail: (id: string) => ['products', id] as const,
  },
  customers: {
    all: ['customers'] as const,
    search: (keyword: string) => ['customers', 'search', keyword] as const,
    detail: (id: string) => ['customers', id] as const,
  },
  rentalOrders: {
    all: ['rental-orders'] as const,
    overdue: ['rental-orders', 'overdue'] as const,
    byCustomer: (customerId: string) => ['rental-orders', 'customer', customerId] as const,
    detail: (id: string) => ['rental-orders', id] as const,
  },
} as const;
