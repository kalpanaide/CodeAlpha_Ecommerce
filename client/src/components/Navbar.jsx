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
    <nav style={{ display: 'flex', gap: '20px', padding: '15px', background: '#222', color: 'white', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white' }}>Home</Link>
      <Link to="/cart" style={{ color: 'white' }}>Cart</Link>
      <Link to="/orders" style={{ color: 'white' }}>My Orders</Link>
      {user ? (
        <>
          <span style={{ marginLeft: 'auto' }}>Hi, {user.name}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: 'white', marginLeft: 'auto' }}>Login</Link>
          <Link to="/register" style={{ color: 'white' }}>Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;