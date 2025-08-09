
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function to get the auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Generic request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // If token is expired or invalid, remove it and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
};

// Auth API
export const signup = async (userData) => {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// Get user profile from JWT token instead of API endpoint
export const getUserProfile = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }
  
  try {
    // Decode JWT to get user info
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    // If token is invalid, remove it and throw error
    localStorage.removeItem('token');
    throw new Error('Invalid token');
  }
};

// Products API
export const getProducts = async () => {
  return apiRequest('/products');
};

// Cart API
export const getCartItems = async () => {
  return apiRequest('/cart');
};

export const addToCart = async (productId, quantity = 1) => {
  return apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
};

export const updateCartItem = async (cartId, quantity) => {
  return apiRequest('/cart', {
    method: 'PUT',
    body: JSON.stringify({ cartId, quantity }),
  });
};

export const removeCartItem = async (cartId) => {
  return apiRequest(`/cart/${cartId}`, {
    method: 'DELETE',
  });
};

// Orders API
export const placeOrder = async () => {
  return apiRequest('/orders', {
    method: 'POST',
  });
};

export const getUserOrders = async () => {
  return apiRequest('/orders');
};

// Admin API
export const getAdminOrders = async () => {
  return apiRequest('/admin/orders');
};

export const updateOrderStatus = async (orderId, status) => {
  return apiRequest(`/admin/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};