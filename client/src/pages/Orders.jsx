import { useState, useEffect } from 'react';
import api from '../api';
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
    api.get('/api/orders/my-orders', {
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
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Please log in to view your orders</h2>
        <Link to="/login" className="inline-block mt-4 text-blue-600 hover:underline">Go to Login</Link>
      </div>
    );
  }

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">No orders yet</h2>
        <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">Start shopping</Link>
      </div>
    );
  }

  const statusColor = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm text-gray-700">{order._id}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-700'}`}>
                {order.status}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600 py-1">
                  <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 mt-3 pt-3">
              <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="font-bold text-gray-800">Total: ₹{order.totalAmount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;