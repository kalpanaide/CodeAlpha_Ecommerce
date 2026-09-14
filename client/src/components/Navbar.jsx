import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center gap-6 px-6 py-4 bg-gray-900 text-white shadow-md">
      <Link to="/" className="text-xl font-bold text-white">🛒 ShopSphere</Link>
      <Link to="/" className="hover:text-blue-400 transition">Home</Link>
      <Link to="/cart" className="hover:text-blue-400 transition">Cart</Link>
      <Link to="/orders" className="hover:text-blue-400 transition">My Orders</Link>

      {user ? (
  <div className="ml-auto flex items-center gap-4">
    {user.isAdmin && (
      <Link to="/admin" className="text-yellow-400 font-medium hover:text-yellow-300 transition">
        Admin Dashboard
      </Link>
    )}
    <span className="text-gray-300">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="border border-white px-3 py-1 rounded-md hover:bg-white hover:text-gray-900 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="ml-auto flex items-center gap-4">
          <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
          <Link to="/register" className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;