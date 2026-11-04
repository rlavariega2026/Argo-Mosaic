import { Product, Order, QuoteRequest, SampleRequest, SalesRep, CompanySettings } from '../types';

// Vite BASE_URL keeps API requests working when hosted below the domain root.
const API_BASE = `${import.meta.env.BASE_URL}api`;

export const apiClient = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      console.error('getProducts error:', err);
      const cached = localStorage.getItem('argo_products_cache');
      return cached ? JSON.parse(cached) : [];
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.product || null;
    } catch (err) {
      console.error('getProduct error:', err);
      return null;
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Unable to create product');
    return data.product;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Unable to update product');
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    return res.ok && !!data.success;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to load orders');
    return data.orders || [];
  },

  async createOrder(orderPayload: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderPayload) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Unable to create order');
    return data.order;
  },

  async updateOrderStatus(id: string, status: string, paymentStatus?: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderStatus: status, paymentStatus }) });
    const data = await res.json();
    return res.ok && !!data.success;
  },

  // Quotes
  async getQuotes(): Promise<QuoteRequest[]> {
    const res = await fetch(`${API_BASE}/quotes`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to load quotes');
    return data.quotes || [];
  },

  async createQuote(quote: Partial<QuoteRequest>): Promise<any> {
    const res = await fetch(`${API_BASE}/quotes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(quote) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Unable to create quote');
    return data;
  },

  async updateQuoteStatus(id: string, status: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/quotes/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const data = await res.json();
    return res.ok && !!data.success;
  },

  // Samples
  async getSamples(): Promise<SampleRequest[]> {
    const res = await fetch(`${API_BASE}/samples`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to load samples');
    return data.samples || [];
  },

  async createSample(sample: Partial<SampleRequest>): Promise<any> {
    const res = await fetch(`${API_BASE}/samples`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sample) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Unable to create sample request');
    return data;
  },

  async updateSampleStatus(id: string, status: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/samples/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const data = await res.json();
    return res.ok && !!data.success;
  },

  // Sales representatives
  async getSalesReps(): Promise<SalesRep[]> {
    const res = await fetch(`${API_BASE}/sales-reps`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to load sales representatives');
    return data.salesReps || [];
  },

  async saveSalesRep(rep: Partial<SalesRep>): Promise<SalesRep> {
    const method = rep.id ? 'PUT' : 'POST';
    const url = rep.id ? `${API_BASE}/sales-reps/${encodeURIComponent(rep.id)}` : `${API_BASE}/sales-reps`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rep) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Unable to save sales representative');
    return data.salesRep;
  },

  async deleteSalesRep(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/sales-reps/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    return res.ok && !!data.success;
  },

  // Settings
  async getSettings(): Promise<CompanySettings> {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Unable to load settings');
    return data.settings;
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const res = await fetch(`${API_BASE}/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Unable to save settings');
    return data.settings ?? settings as CompanySettings;
  },

  // File upload
  async uploadFile(file: File): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'File upload failed');
    }
    return res.json();
  },

  // Admin login
  async adminLogin(username: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    return res.json();
  },

  // PayPal is deliberately not simulated: only the server may create/capture a real payment.
  async createPayPalOrder(orderId: string, amount: number): Promise<{ id: string; status: string }> {
    const res = await fetch(`${API_BASE}/paypal/create-order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemOrderId: orderId, amount }) });
    const data = await res.json();
    if (!res.ok || !data.success || !data.orderId) throw new Error(data.message || 'PayPal order could not be created');
    return { id: data.orderId, status: 'CREATED' };
  },

  async capturePayPalPayment(paypalOrderId: string, orderId: string): Promise<{ status: string; id: string }> {
    const res = await fetch(`${API_BASE}/paypal/capture-order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: paypalOrderId, systemOrderId: orderId }) });
    const data = await res.json();
    if (!res.ok || !data.success || data.status !== 'Approved') throw new Error(data.message || 'PayPal payment was not confirmed');
    return { status: 'COMPLETED', id: paypalOrderId };
  }
};
