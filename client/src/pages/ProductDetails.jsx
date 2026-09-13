import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;
  if (!product) return <p style={{ padding: '20px' }}>Product not found.</p>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>₹{product.price}</h2>
      <p>In stock: {product.stock}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0' }}>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: '60px', padding: '5px' }}
        />
      </div>

      <button onClick={handleAddToCart} style={{ padding: '10px 20px', background: '#222', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetails;