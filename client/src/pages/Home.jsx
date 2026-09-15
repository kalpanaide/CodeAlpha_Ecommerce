import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchProducts = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;

    axios.get('http://localhost:5000/api/products', { params })
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // Fetch all products once initially to build the category dropdown list
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        const uniqueCategories = [...new Set(res.data.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setRecommendations(res.data))
        .catch(err => console.error(err));
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {recommendations.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map(product => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
              >
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
                <p className="text-xs text-gray-500 mt-2 italic">{product.reason}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>

      {/* Search, Filter, Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;