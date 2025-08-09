"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { getUserOrders } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h3>You haven't placed any orders yet</h3>
          <p className="mb-4">Start shopping to place your first order</p>
          <a href="/" className="btn btn-primary">Continue Shopping</a>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      data-bs-toggle="collapse" 
                      data-bs-target={`#items-${order._id}`}
                    >
                      View Items
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.map((order) => (
            <div key={`collapse-${order._id}`} className="collapse mb-3" id={`items-${order._id}`}>
              <div className="card card-body">
                <h5 className="mb-3">Order Items</h5>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProtectedRoute(OrdersPage);