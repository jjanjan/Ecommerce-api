export interface Customer {
  customer_id?: number;
  name: string;
  email: string;
}

export interface Product {
  product_id?: number;
  name: string;
  quantity: number;
}

export interface Order {
  order_id?: number;
  customer: number;
  customer_name?: string;
  order_date?: string;
}

export interface OrderItem {
  id?: number;
  order: number;
  order_display?: string;
  product: number;
  product_name?: string;
  quantity: number;
}