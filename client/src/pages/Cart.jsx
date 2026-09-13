import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
        {cartItems.map(item => (
          <div key={item._id} className="flex items-center gap-4 p-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-500 text-sm">₹{item.price} each</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
              className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="font-semibold text-gray-800 w-20 text-right">₹{item.price * item.quantity}</p>
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-bold text-gray-800">Total: ₹{total}</h2>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;