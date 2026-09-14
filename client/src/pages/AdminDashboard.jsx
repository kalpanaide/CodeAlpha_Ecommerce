import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '', stock: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!user?.isAdmin) {
    return <p className="text-center text-red-500 mt-10">Access denied. Admins only.</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required className="border border-gray-300 rounded-md px-4 py-2" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-2" />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="border border-gray-300 rounded-md px-4 py-2" />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required className="border border-gray-300 rounded-md px-4 py-2" />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-2 md:col-span-2" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-2 md:col-span-2" rows="3" />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', image: '', category: '', stock: '' }); }} className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">All Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {products.map(product => (
            <div key={product._id} className="flex items-center gap-4 p-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500">₹{product.price} · Stock: {product.stock}</p>
              </div>
              <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:underline text-sm font-medium">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;