import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProduct = () => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchReviews = () => {
    axios.get(`http://localhost:5000/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (!product) return <p className="text-center text-gray-500 mt-10">Product not found.</p>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    try {
      await axios.post(
        'http://localhost:5000/api/reviews',
        { productId: id, rating: Number(reviewForm.rating), comment: reviewForm.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewSuccess('Review posted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to post review');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-72 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

          {avgRating && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-500 font-semibold">★ {avgRating}</span>
              <span className="text-gray-500 text-sm">({reviews.length} review{reviews.length > 1 ? 's' : ''})</span>
            </div>
          )}

          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-3xl font-bold text-blue-600 mt-4">₹{product.price}</p>
          <p className="text-sm text-gray-500 mt-1">In stock: {product.stock}</p>

          <div className="flex items-center gap-3 mt-6">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

        {token && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
            {reviewError && <p className="text-red-500 mb-3 text-sm">{reviewError}</p>}
            {reviewSuccess && <p className="text-green-600 mb-3 text-sm">{reviewSuccess}</p>}
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-32"
              >
                <option value="5">★★★★★ (5)</option>
                <option value="4">★★★★ (4)</option>
                <option value="3">★★★ (3)</option>
                <option value="2">★★ (2)</option>
                <option value="1">★ (1)</option>
              </select>
              <textarea
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
                rows="3"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition w-fit"
              >
                Submit Review
              </button>
              <p className="text-xs text-gray-400">Note: you can only review products you've purchased.</p>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{review.user?.name || 'User'}</span>
                    {review.verifiedPurchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;