export type ProductStatus = 'Available' | 'Rented' | 'Maintenance' | 'Retired';

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string | null;
  dailyRentalPrice: number;
  status: ProductStatus;
  statusDisplay: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  dailyRentalPrice: number;
  categoryId: string;
  description: string | null;
}

export interface UpdateProductRequest {
  code: string;
  name: string;
  dailyRentalPrice: number;
  categoryId: string;
  description: string | null;
}
