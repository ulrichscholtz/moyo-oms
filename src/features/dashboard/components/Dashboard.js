import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New product state
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  // Get logged-in user and fetch data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
      navigate('/login');
      return;
    }
    setUserEmail(user.email);

    // Fetch products for user
    fetch(`http://localhost:8080/api/products?userId=${user.userId}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));

    // Fetch orders for user
    fetch(`http://localhost:8080/api/orders?userId=${user.userId}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen(open => !open);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('loggedInUser'); // Clear session
      navigate("/login");
    }
  };

  // Product editing
  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleEditProduct = (product) => {
    fetch(`http://localhost:8080/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        alert('Product updated successfully!');
      })
      .catch(err => console.error(err));
  };

  const handleDeleteProduct = (productId) => {
    fetch(`http://localhost:8080/api/products/${productId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        setProducts(products.filter(p => p.id !== productId));
      })
      .catch(err => console.error(err));
  };

  const handleCreateProduct = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all product fields.');
      return;
    }

    const productToSend = { ...newProduct, userId: user.userId };

    fetch('http://localhost:8080/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToSend)
    })
      .then(res => res.json())
      .then(created => {
        setProducts([...products, created]);
        setNewProduct({ name: '', price: '', stock: '' }); // reset form
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="dashboard-container">
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        style={{ position: 'absolute', left: sidebarOpen ? 220 : 10, top: 20, zIndex: 1000 }}
      >
        {sidebarOpen ? '⟨' : '⟩'}
      </button>

      <aside className="dashboard-sidebar" style={{ display: sidebarOpen ? 'block' : 'none' }}>
        <h2>Menu</h2>
        <ul>
          <li>Dashboard</li>
          <li>Products</li>
          <li>Orders</li>
          <li>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? 220 : 0, transition: 'margin-left 0.2s' }}>
        <h1 className="dashboard-title">Vendor Dashboard</h1>
        <div className="dashboard-subtitle">
          Signed in as <span className="dashboard-email">{userEmail}</span>
        </div>

        <section className="manage-products-section">
          <h2>Manage Products</h2>

          {/* Create Product Form */}
          <div className="create-product-form">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Price"
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
            <button className="primary-button" onClick={handleCreateProduct}>Add Product</button>
          </div>

          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>PRICE (ZAR)</th>
                  <th>STOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>
                      <input
                        type="text"
                        value={p.price}
                        onChange={e => handleProductChange(idx, 'price', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={p.stock}
                        onChange={e => handleProductChange(idx, 'stock', e.target.value)}
                      />
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditProduct(p)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="orders-section">
          <h2>Orders</h2>
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>PRODUCT</th>
                  <th>VENDOR</th>
                  <th>STATUS</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.product}</td>
                    <td>You</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
