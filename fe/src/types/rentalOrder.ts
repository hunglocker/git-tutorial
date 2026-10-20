export type RentalStatus =
  | 'Pending'
  | 'Active'
  | 'Returned'
  | 'Cancelled'
  | 'Overdue';

export type PaymentStatus =
  | 'Unpaid'
  | 'Paid'
  | 'Refunded'
  | 'PartiallyPaid';

export interface RentalOrder {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  productCode: string;
  startDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  dailyRentalPrice: number;
  totalAmount: number;
  depositAmount: number;
  status: RentalStatus;
  statusDisplay: string;
  paymentStatus: PaymentStatus;
  paymentStatusDisplay: string;
  note: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateRentalOrderRequest {
  customerId: string;
  productId: string;
  startDate: string;
  expectedReturnDate: string;
  depositAmount: number;
  note: string | null;
}

export interface ReturnRentalOrderRequest {
  actualReturnDate: string;
}

export interface CancelRentalOrderRequest {
  reason: string | null;
}
