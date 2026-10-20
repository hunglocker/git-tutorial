export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  description: string | null;
}

export interface UpdateCategoryRequest {
  name: string;
  description: string | null;
}
