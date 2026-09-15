import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '', stock: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const fetchOrders = () => {
    axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  if (!user?.isAdmin) {
    return <p className="text-center text-red-500 mt-10">Access denied. Admins only.</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!imageFile) return form.image;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setUploading(false);
      return res.data.imageUrl;
    } catch (err) {
      setUploading(false);
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const uploadedImageUrl = await handleImageUpload();
      const payload = { ...form, image: uploadedImageUrl, price: Number(form.price), stock: Number(form.stock) };
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
      setImageFile(null);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
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
    setImageFile(null);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 font-medium ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <>
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
              </div>
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-2 md:col-span-2" rows="3" />
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
                  {uploading ? 'Uploading image...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', image: '', category: '', stock: '' }); setImageFile(null); }} className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Products</h2>
          {loading ? <p>Loading...</p> : (
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
        </>
      )}

      {activeTab === 'orders' && (
        <div className="flex flex-col gap-4">
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Order by {order.user?.name} ({order.user?.email})</p>
                    <p className="font-mono text-xs text-gray-400">{order._id}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 ${statusColor[order.status]}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-600 py-1">
                      <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <p className="font-bold text-gray-800 text-right mt-2">Total: ₹{order.totalAmount}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;