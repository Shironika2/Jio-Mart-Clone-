import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { Order, OrderItem } from '../../types';

export default function Orders() {
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderHistory = () => {
      setLoading(true);
      setError(null);
      try {
        const storedOrders = localStorage.getItem('purchaseHistory');
        const orders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
        setOrderHistory(orders);
      } catch (err: any) {
        console.error("Error fetching order history:", err);
        setError("Failed to load order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div style={{ width: '85vw', padding: '2rem', boxSizing: 'border-box' }}>
      <h2 className="mb-3 fw-bold">My Orders</h2>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
          </div>
          <p>Loading order history...</p>
        </div>
      )}

      {error && <div className="alert alert-danger text-center my-5">{error}</div>}

      {!loading && orderHistory.length === 0 && !error && (
        <div className="text-center my-5">
          <p>You haven't placed any orders yet.</p>
          <p>Start shopping and your orders will appear here!</p>
          <Link to="/" className="btn btn-primary mt-3">Shop Now</Link>
        </div>
      )}

      {!loading && orderHistory.length > 0 && !error && (
        <>
          {orderHistory.map((order) => (
            <div key={order.orderId} className="mb-5">
              <div className="mb-3">
                <h5>Order ID: {order.orderId}</h5>
                <small className="text-muted">Ordered on: {order.orderDate}</small>
              </div>

              {order.items.map((item: OrderItem) => (
                <div
                  key={`${order.orderId}-${item.id}`}
                  className="card mb-3 shadow-sm"
                  style={{ maxWidth: '600px', width: '100%' }}
                >
                  <div className="row g-0 align-items-center">
                    <div className="col-auto p-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ height: '100px', width: '100px', objectFit: 'contain' }}
                      />
                    </div>
                    <div className="col p-3">
                      <h6 className="mb-1">{item.title}</h6>
                      <p className="text-muted mb-1">Qty: {item.quantity}</p>
                     <p className="fw-bold mb-0">
  ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</p>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
