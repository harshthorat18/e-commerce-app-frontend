"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { getCartItems, updateCartItem, removeCartItem } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems();
        setCartItems(items);
        
        // Calculate total
        const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(cartTotal);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(cartId, newQuantity);
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      // Recalculate total
      const updatedTotal = cartItems.reduce((sum, item) => 
        item.id === cartId ? sum + (item.price * newQuantity) : sum + (item.price * item.quantity), 0);
      setTotal(updatedTotal);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await removeCartItem(cartId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartId));
      
      // Recalculate total
      const removedItem = cartItems.find(item => item.id === cartId);
      if (removedItem) {
        setTotal(prevTotal => prevTotal - (removedItem.price * removedItem.quantity));
      }
    } catch (error) {
      console.error('Failed to remove cart item:', error);
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
      <h1 className="mb-4">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h3>Your cart is empty</h3>
          <p className="mb-4">Add some products to your cart</p>
          <Link href="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.image || 'https://via.placeholder.com/80'} 
                          alt={item.name} 
                          className="img-thumbnail me-3" 
                          style={{ width: '80px' }}
                        />
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                        </div>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className="input-group" style={{ width: '120px' }}>
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          className="form-control text-center" 
                          value={item.quantity} 
                          readOnly 
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="row mt-4">
            <div className="col-md-6">
              <Link href="/" className="btn btn-outline-secondary">
                Continue Shopping
              </Link>
            </div>
            <div className="col-md-6 text-md-end">
              <h4>Total: ${total.toFixed(2)}</h4>
              <Link href="/checkout" className="btn btn-primary mt-2">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProtectedRoute(CartPage);