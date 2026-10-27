import axiosClient from './axiosClient';

/**
 * Service module providing direct integration with Spring Boot Order REST APIs.
 */
export const orderService = {
  /**
   * Health check / demo endpoint
   * GET /order/
   */
  async checkHealth() {
    const response = await axiosClient.get('/order/', {
      headers: { Accept: 'text/plain' },
    });
    return response.data;
  },

  /**
   * Fetch all orders
   * GET /order/displayall
   */
  async getAllOrders() {
    const response = await axiosClient.get('/order/displayall');
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Fetch a single order by ID
   * GET /order/display?id={id}
   */
  async getOrderById(id) {
    const response = await axiosClient.get('/order/display', {
      params: { id },
    });
    return response.data;
  },

  /**
   * Create a new order
   * POST /order/add
   * Body: { name, type, status, location }
   */
  async createOrder(orderData) {
    const payload = {
      name: orderData.name?.trim(),
      type: orderData.type?.trim(),
      status: orderData.status?.trim() || 'Pending',
      location: orderData.location?.trim(),
    };
    const response = await axiosClient.post('/order/add', payload);
    return response.data;
  },

  /**
   * Update an existing order
   * PUT /order/update
   * Body: { orderId, name, type, status, location }
   */
  async updateOrder(orderData) {
    const payload = {
      orderId: Number(orderData.orderId),
      name: orderData.name?.trim(),
      type: orderData.type?.trim(),
      status: orderData.status?.trim(),
      location: orderData.location?.trim(),
    };
    const response = await axiosClient.put('/order/update', payload);
    return response.data;
  },

  /**
   * Delete order by ID
   * DELETE /order/delete/{id}
   */
  async deleteOrder(id) {
    const response = await axiosClient.delete(`/order/delete/${id}`, {
      headers: { Accept: 'text/plain' },
    });
    return response.data;
  },

  /**
   * Search orders by item / customer name
   * GET /order/displaybyname/{name}
   */
  async getOrdersByName(name) {
    if (!name || !name.trim()) {
      return this.getAllOrders();
    }
    const response = await axiosClient.get(`/order/displaybyname/${encodeURIComponent(name.trim())}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Filter orders by product / category type
   * GET /order/displaybytype/{type}
   */
  async getOrdersByType(type) {
    if (!type || type === 'ALL' || !type.trim()) {
      return this.getAllOrders();
    }
    const response = await axiosClient.get(`/order/displaybytype/${encodeURIComponent(type.trim())}`);
    return Array.isArray(response.data) ? response.data : [];
  },
};

export default orderService;
