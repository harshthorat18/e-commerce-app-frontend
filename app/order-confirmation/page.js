"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              </div>
              
              <h2 className="mb-3">Order Confirmed!</h2>
              <p className="mb-4">Thank you for your purchase. Your order has been placed successfully.</p>
              
              {orderId && (
                <div className="alert alert-info d-inline-block">
                  Order ID: <strong>#{orderId.substring(0, 8)}</strong>
                </div>
              )}
              
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Link href="/" className="btn btn-outline-primary">
                  Continue Shopping
                </Link>
                <Link href="/orders" className="btn btn-primary">
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;