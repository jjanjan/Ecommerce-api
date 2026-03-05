import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// --- Customers ---
export const getCustomers = () => API.get('/customers/');
export const createCustomer = (data: any) => API.post('/customers/', data);
export const updateCustomer = (id: number, data: any) => API.put(`/customers/${id}/`, data);
export const deleteCustomer = (id: number) => API.delete(`/customers/${id}/`);

// --- Products ---
export const getProducts = () => API.get('/products/');
export const createProduct = (data: any) => API.post('/products/', data);
export const updateProduct = (id: number, data: any) => API.put(`/products/${id}/`, data);
export const deleteProduct = (id: number) => API.delete(`/products/${id}/`);

// --- Orders ---
export const getOrders = () => API.get('/orders/');
export const createOrder = (data: any) => API.post('/orders/', data);
export const updateOrder = (id: number, data: any) => API.put(`/orders/${id}/`, data);
export const deleteOrder = (id: number) => API.delete(`/orders/${id}/`);

// --- Order Items ---
export const getOrderItems = () => API.get('/order-items/');
export const createOrderItem = (data: any) => API.post('/order-items/', data);
export const updateOrderItem = (id: number, data: any) => API.put(`/order-items/${id}/`, data);
export const deleteOrderItem = (id: number) => API.delete(`/order-items/${id}/`);