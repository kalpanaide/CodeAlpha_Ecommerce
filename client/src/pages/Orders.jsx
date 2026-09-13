import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios.get('http://localhost:5000/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Please log in to view your orders</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  if (loading) return <p style={{ padding: '20px' }}>Loading orders...</p>;

  if (orders.length === 0) {
    return <div style={{ padding: '20px' }}><h2>No orders yet</h2></div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <h1>My Orders</h1>
      {orders.map(order => (
        <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <div>
            {order.items.map((item, idx) => (
              <p key={idx}>{item.product?.name || 'Product'} x {item.quantity} — ₹{item.price * item.quantity}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;