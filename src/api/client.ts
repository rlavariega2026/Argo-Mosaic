import { Product, Order, QuoteRequest, SampleRequest, SalesRep, CompanySettings } from '../types';

const API_BASE = '/api';

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
      // Fallback to localStorage if any
      const cached = localStorage.getItem('argo_products_cache');
      return cached ? JSON.parse(cached) : [];
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.product || null;
    } catch (err) {
      console.error('getProduct error:', err);
      return null;
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    return data.product;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return data.success;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    return data.orders || [];
  },

  async createOrder(orderPayload: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    return data.order;
  },

  async updateOrderStatus(id: string, status: string, paymentStatus?: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus: status, paymentStatus }),
    });
    const data = await res.json();
    return data.success;
  },

  // Quotes
  async getQuotes(): Promise<QuoteRequest[]> {
    const res = await fetch(`${API_BASE}/quotes`);
    const data = await res.json();
    return data.quotes || [];
  },

  async createQuote(quote: Partial<QuoteRequest>): Promise<any> {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    return res.json();
  },

  async updateQuoteStatus(id: string, status: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    return data.success;
  },

  // Samples
  async getSamples(): Promise<SampleRequest[]> {
    const res = await fetch(`${API_BASE}/samples`);
    const data = await res.json();
    return data.samples || [];
  },

  async createSample(sample: Partial<SampleRequest>): Promise<any> {
    const res = await fetch(`${API_BASE}/samples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sample),
    });
    return res.json();
  },

  async updateSampleStatus(id: string, status: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/samples/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    return data.success;
  },

  // Sales Reps
  async getSalesReps(): Promise<SalesRep[]> {
    const res = await fetch(`${API_BASE}/sales-reps`);
    const data = await res.json();
    return data.salesReps || [];
  },

  async saveSalesRep(rep: Partial<SalesRep>): Promise<SalesRep> {
    const method = rep.id ? 'PUT' : 'POST';
    const url = rep.id ? `${API_BASE}/sales-reps/${rep.id}` : `${API_BASE}/sales-reps`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rep),
    });
    const data = await res.json();
    return data.salesRep;
  },

  async deleteSalesRep(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/sales-reps/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return data.success;
  },

  // Settings
  async getSettings(): Promise<CompanySettings> {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    return data.settings;
  },

  // File Upload
  async uploadFile(file: File): Promise<{ fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('File upload failed');
    return res.json();
  },

  // Admin Login
  async adminLogin(username: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  // PayPal Transactions
  async createPayPalOrder(orderId: string, amount: number): Promise<{ id: string; status: string }> {
    return {
      id: `PAYID-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: 'CREATED'
    };
  },

  async capturePayPalPayment(paypalOrderId: string, orderId: string): Promise<{ status: string; id: string }> {
    await this.updateOrderStatus(orderId, 'processing', 'Approved');
    return {
      status: 'COMPLETED',
      id: paypalOrderId
    };
  }
};
