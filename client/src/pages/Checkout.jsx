import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!token) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Please log in to checkout</h2>
        <Link to="/login" className="inline-block mt-4 text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
        <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
          Go back to shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const items = cartItems.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      await axios.post(
        'http://localhost:5000/api/orders',
        { items, totalAmount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
        {cartItems.map(item => (
          <div key={item._id} className="flex justify-between p-4">
            <span className="text-gray-700">{item.name} × {item.quantity}</span>
            <span className="font-medium text-gray-800">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-bold text-gray-800">Total: ₹{total}</h2>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

export default Checkout;