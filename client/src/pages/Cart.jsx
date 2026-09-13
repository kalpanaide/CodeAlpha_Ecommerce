import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Your cart is empty</h2>
        <Link to="/">Go back to shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <h1>Your Cart</h1>
      {cartItems.map(item => (
        <div key={item._id} style={{ display: 'flex', gap: '15px', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '10px 0' }}>
          <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>₹{item.price} each</p>
          </div>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
            style={{ width: '60px', padding: '5px' }}
          />
          <p>₹{item.price * item.quantity}</p>
          <button onClick={() => removeFromCart(item._id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
            Remove
          </button>
        </div>
      ))}

      <h2 style={{ marginTop: '20px' }}>Total: ₹{total}</h2>

      <button
        onClick={() => navigate('/checkout')}
        style={{ padding: '10px 20px', background: '#222', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Cart;