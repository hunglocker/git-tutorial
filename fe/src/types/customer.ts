export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  address: string | null;
  identityNumber: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCustomerRequest {
  fullName: string;
  phone: string;
  email: string | null;
  address: string | null;
  identityNumber: string | null;
}

export interface UpdateCustomerRequest {
  fullName: string;
  phone: string;
  email: string | null;
  address: string | null;
  identityNumber: string | null;
}
