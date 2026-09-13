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
      <div style={{ padding: '20px' }}>
        <h2>Please log in to checkout</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Your cart is empty</h2>
        <Link to="/">Go back to shopping</Link>
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
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h1>Checkout</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cartItems.map(item => (
        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ddd' }}>
          <span>{item.name} x {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}
      <h2 style={{ marginTop: '20px' }}>Total: ₹{total}</h2>
      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        style={{ padding: '10px 20px', background: '#222', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
      >
        {placing ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
}

export default Checkout;