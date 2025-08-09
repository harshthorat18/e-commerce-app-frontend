
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { addToCart } from '@/lib/api';

function ProductCard({ product }) {
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product._id, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="card product-card h-100">
      <img 
        src={product.image || 'https://via.placeholder.com/300'} 
        className="card-img-top" 
        alt={product.name} 
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted flex-grow-1">
          {product.description || 'High quality product with great features.'}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="h5 mb-0">${product.price.toFixed(2)}</span>
          <button 
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;