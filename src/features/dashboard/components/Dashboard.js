import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [productMessage, setProductMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
      navigate('/login');
      return;
    }
    setUserEmail(user.email);

    fetch(`http://localhost:8080/api/products?userId=${user.userId}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));

    fetch(`http://localhost:8080/api/orders?userId=${user.userId}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen(open => !open);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('loggedInUser');
      navigate("/login");
    }
  };

  const handleCreateProduct = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;

    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setProductMessage('Please fill in all product fields.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
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
        setNewProduct({ name: '', price: '', stock: '' });
        setProductMessage('Product added successfully!');
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        setFormOpen(false);
      })
      .catch(err => {
        console.error(err);
        setProductMessage('Failed to add product. Try again.');
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      });
  };

  const confirmDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = () => {
    fetch(`http://localhost:8080/api/products/${productToDelete}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        setProducts(products.filter(p => p.id !== productToDelete));
        setDeleteModalOpen(false);
        setProductToDelete(null);
      })
      .catch(err => console.error(err));
  };

  // Open edit modal
  const openEditModal = (product) => {
    setProductToEdit({ ...product });
    setEditModalOpen(true);
  };

  const handleEditChange = (field, value) => {
    setProductToEdit(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    fetch(`http://localhost:8080/api/products/${productToEdit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToEdit)
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        setProducts(products.map(p => p.id === productToEdit.id ? productToEdit : p));
        setEditModalOpen(false);
        setProductToEdit(null);
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

          <div className={`create-product-form ${formOpen ? 'show' : 'hide'}`}>
            {formOpen && (
              <>
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
              </>
            )}

            <button
              className={`add-product-btn ${formOpen ? 'cancel' : ''}`}
              onClick={() => setFormOpen(!formOpen)}
            >
              {formOpen ? 'Cancel' : 'Add Product'}
            </button>

            {formOpen && (
              <button className="create-btn" onClick={handleCreateProduct}>
                Create
              </button>
            )}

            {showMessage && <div className="product-message">{productMessage}</div>}
          </div>

          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>PROD ID</th>
                  <th>PRODUCT</th>
                  <th>PRICE (ZAR)</th>
                  <th>STOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button className="edit-btn" onClick={() => openEditModal(p)}>Edit</button>
                      <button className="delete-btn" onClick={() => confirmDeleteProduct(p.id)}>Delete</button>
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

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Deletion</h3>
            <p>Are you sure? This is irreversible!</p>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="modal-btn delete-confirm-btn" onClick={handleDeleteProduct}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && productToEdit && (
  <div className="edit-modal-overlay">
    <div className="edit-modal-box">
      <h3>Edit Product</h3>
      <div className="modal-divider"></div>

      <div className="edit-field">
        <label>Product ID:</label>
        <span className="readonly-field">{productToEdit.id}</span>
      </div>

      <div className="modal-divider"></div>

      <div className="edit-field">
        <label>Name:</label>
        <input
          type="text"
          value={productToEdit.name}
          onChange={e => handleEditChange('name', e.target.value)}
        />
      </div>

      <div className="edit-field">
        <label>Price:</label>
        <input
          type="text"
          value={productToEdit.price}
          onChange={e => handleEditChange('price', e.target.value)}
        />
      </div>

      <div className="edit-field">
        <label>Stock:</label>
        <input
          type="number"
          value={productToEdit.stock}
          onChange={e => handleEditChange('stock', e.target.value)}
        />
      </div>

      <div className="modal-divider"></div>

      <div className="edit-modal-actions">
        <button className="modal-btn cancel-btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
        <button className="modal-btn save-btn" onClick={handleSaveEdit}>Save</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Dashboard;
