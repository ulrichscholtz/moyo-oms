import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

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

  // Product modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  // Order modals
  const [editOrderModalOpen, setEditOrderModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [deleteOrderModalOpen, setDeleteOrderModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [orderMessage, setOrderMessage] = useState('');
  const [showOrderMessage, setShowOrderMessage] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    navigate('/login');
    return;
  }
  setUserEmail(user.email);

  fetch(`http://localhost:8080/api/products?userId=${user.userId}`)
    .then(res => res.json())
    .then(data => {
  const productsWithCode = data.map((p, index) => ({
    ...p,
    prodCode: `PROD-${String(index + 1).padStart(4, '0')}` // fixed, stored in state
  }));
  setProducts(productsWithCode);
})
    .catch(err => console.error(err));
}, [navigate]);

  const toggleSidebar = () => setSidebarOpen(open => !open);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('loggedInUser');
      navigate("/login");
    }
  };

  // ----- PRODUCT HANDLERS -----
  const handleCreateProduct = () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) return;

  if (!newProduct.name || !newProduct.price || !newProduct.stock) {
    setProductMessage('Please fill in all product fields.');
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
    return;
  }

  const productToSend = { ...newProduct, price: parseFloat(newProduct.price).toFixed(2), userId: user.userId };

  fetch('http://localhost:8080/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productToSend)
  })
    .then(res => res.json())
    .then(created => {
      // Assign a fixed PROD code based on current number of products
      const newProductWithCode = {
        ...created,
        prodCode: `PROD-${String(products.length + 1).padStart(4, '0')}`
      };

      setProducts([...products, newProductWithCode]);
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
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const msg = errorData?.message || 'Cannot delete this product while an order is pending.';
          setDeleteErrorMessage(msg);
          setDeleteErrorModalOpen(true);
          setDeleteModalOpen(false);
          return;
        }
        setProducts(products.filter(p => p.id !== productToDelete));
        setDeleteModalOpen(false);
        setProductToDelete(null);
      })
      .catch(err => {
        console.error(err);
        setDeleteErrorMessage('Error deleting product. Try again.');
        setDeleteErrorModalOpen(true);
        setDeleteModalOpen(false);
      });
  };

  const handleDeleteAllOrders = async () => {
  if (!window.confirm("Are you sure you want to delete ALL orders?")) return;

  try {
    for (const order of orders) {
      let res;
      try {
        res = await fetch(`http://localhost:8080/api/orders/${order.id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error(`Error deleting order ${order.id}:`, err);
        continue; // skip to next order
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const msg = errorData?.message || `Cannot delete order ${order.id}.`;
        alert(msg); // you could also show a modal if you prefer
        continue; // skip to next order
      }

      // Update product stock for the deleted order
      setProducts(prev =>
        prev.map(p =>
          p.id === order.productId
            ? { ...p, stock: p.stock + order.amount }
            : p
        )
      );
    }

    // Clear all orders from state after deletion
    setOrders([]);
    setOrderMessage("All orders deleted successfully.");
    setShowOrderMessage(true);
    setTimeout(() => setShowOrderMessage(false), 3000);

  } catch (err) {
    console.error("Error deleting all orders:", err);
    alert("Error deleting all orders. Try again.");
  }
};

  const openEditModal = (product) => {
  setProductToEdit({ ...product }); // keep displayId from state
  setEditModalOpen(true);
};

  const handleEditChange = (field, value) => {
    setProductToEdit(prev => ({ ...prev, [field]: value }));
  };


  const handleSaveEdit = () => {
  // Create a version of the product with price fixed to 2 decimals
  const editedProductToSend = {
    ...productToEdit,
    price: parseFloat(productToEdit.price).toFixed(2)
  };

  fetch(`http://localhost:8080/api/products/${productToEdit.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedProductToSend) // <-- send this instead of productToEdit
  })
    .then(res => {
      if (!res.ok) throw new Error('Update failed');
      setProducts(products.map(p => p.id === productToEdit.id ? editedProductToSend : p)); // update state with fixed price
      setEditModalOpen(false);
      setProductToEdit(null);
    })
    .catch(err => console.error(err));
};

  // ----- ORDER HANDLERS -----
  const handleSimulateOrders = async () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) return;

  if (products.length === 0 || products.every(p => p.stock === 0)) {
    setOrderMessage("No products available to simulate orders.");
    setShowOrderMessage(true);
    setTimeout(() => setShowOrderMessage(false), 3000);
    return;
  }

  const statuses = ["Pending", "Delivered", "Cancelled"];
  const ordersToSimulate = [];

  // Generate 3 simulated orders
  for (let i = 0; i < 3; i++) {
    const availableProducts = products.filter(p => p.stock > 0);
    if (availableProducts.length === 0) break; // No stock left

    const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    const maxAmount = Math.min(5, randomProduct.stock); // Cannot order more than stock
    const randomAmount = Math.floor(Math.random() * maxAmount) + 1;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    ordersToSimulate.push({
      productId: randomProduct.id,
      amount: randomAmount,
      status: randomStatus,
      userId: user.userId
    });
  }

  try {
    const createdOrders = [];

    for (const order of ordersToSimulate) {
      const res = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (!res.ok) throw new Error('Failed to create order');

      const createdOrder = await res.json();
      createdOrders.push(createdOrder);

      // Update product stock in state
      setProducts(prev =>
        prev.map(p =>
          p.id === createdOrder.product.id
            ? { ...p, stock: p.stock - createdOrder.amount }
            : p
        )
      );
    }

    setOrders(prev => [...prev, ...createdOrders]);

  } catch (err) {
    console.error(err);
    setOrderMessage("Error simulating orders. Try again.");
    setShowOrderMessage(true);
    setTimeout(() => setShowOrderMessage(false), 3000);
  }
};

  const openEditOrderModal = (order) => {
    setOrderToEdit({ ...order });
    setEditOrderModalOpen(true);
  };

  const handleEditOrderChange = (field, value) => {
    setOrderToEdit(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveOrderEdit = () => {
    setOrders(orders.map(o => o.id === orderToEdit.id ? orderToEdit : o));
    setEditOrderModalOpen(false);
    setOrderToEdit(null);
  };

  const confirmDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteOrderModalOpen(true);
  };

  const handleDeleteOrder = async () => {
  try {
    const res = await fetch(`http://localhost:8080/api/orders/${orderToDelete}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      // Optionally, you can show an error message here
      alert('Failed to delete order. Try again.');
      return;
    }

    // Update local state only if deletion succeeded
    setOrders(orders.filter(o => o.id !== orderToDelete));
    setDeleteOrderModalOpen(false);
    setOrderToDelete(null);
  } catch (err) {
    console.error(err);
    alert('Error deleting order. Try again.');
  }
};

const filteredOrders = orders
  .map((o, index) => ({
    ...o,
    displayId: `ORD-${String(index + 1).padStart(4, '0')}` // ORD-0001, ORD-0002...
  }))
  .filter(o => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      o.displayId.toLowerCase().includes(query) ||
      o.product?.name.toLowerCase().includes(query) ||
      o.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar Toggle */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        style={{ position: 'absolute', left: sidebarOpen ? 220 : 10, top: 20, zIndex: 1000 }}
      >
        {sidebarOpen ? '⟨' : '⟩'}
      </button>

      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{ display: sidebarOpen ? 'block' : 'none' }}>
        <h2>Menu</h2>
        <ul>
          <li>Dashboard</li>
          <li>Statistics</li>
          <li>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* Main Dashboard */}
      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? 220 : 0, transition: 'margin-left 0.2s' }}>
        <h1 className="dashboard-title">Vendor Dashboard</h1>
        <div className="dashboard-subtitle">
          Signed in as <span className="dashboard-email">{userEmail}</span>
        </div>

        {/* Manage Products */}
        <section className="manage-products-section">
          <h2>Manage Products</h2>
          <div className={`create-product-form ${formOpen ? 'show' : 'hide'}`}>
            {formOpen && (
              <>
                <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                <input 
  type="number" 
  step="0.01" 
  placeholder="Price" 
  value={newProduct.price} 
  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} 
/>
                <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
              </>
            )}
            <button className={`add-product-btn ${formOpen ? 'cancel' : ''}`} onClick={() => setFormOpen(!formOpen)}>
              {formOpen ? 'Cancel' : 'Add Product'}
            </button>
            {formOpen && <button className="create-btn" onClick={handleCreateProduct}>Create</button>}
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
  <AnimatePresence>
    {products.length > 0 ? (
      products.map(p => (
        <motion.tr
          key={p.prodCode}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <td>{p.prodCode}</td>
          <td>{p.name}</td>
          <td>{parseFloat(p.price).toFixed(2)}</td>
          <td>{p.stock}</td>
          <td>
            <button className="edit-btn" onClick={() => openEditModal(p)}>Edit</button>
            <button className="delete-btn" onClick={() => confirmDeleteProduct(p.id)}>Delete</button>
          </td>
        </motion.tr>
      ))
    ) : (
      <tr style={{ height: '100px' }}>
        <td colSpan="5" style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic', fontSize: '1.2em' }}>
          No Products Yet
        </td>
      </tr>
    )}
  </AnimatePresence>
</tbody>

            </table>
          </div>
        </section>

        {/* Orders Section */}
<section className="orders-section">
  <h2>Orders</h2>

  <div className="simulate-orders-wrapper">
  <button className="simulate-orders-btn" onClick={handleSimulateOrders}>
    Simulate Orders
  </button>

  <button className="delete-all-orders-btn" onClick={handleDeleteAllOrders}>
    Delete All Orders
  </button>

  {/* Search */}
  <div className={`search-container ${searchOpen ? 'active' : ''}`}>
  <button className="search-toggle-btn" onClick={() => setSearchOpen(!searchOpen)}>
    🔍
  </button>
  <input
    type="text"
    placeholder="Search Order ID..."
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    className="search-input"
  />
</div>


  {showOrderMessage && <div className="order-message">{orderMessage}</div>}
</div>

  <div className="orders-table-container">
    <table className="orders-table">
      <thead>
        <tr>
          <th>ORDER ID</th>
          <th>DATE OF ORDER</th>
          <th>PRODUCT</th>
          <th>AMOUNT</th>
          <th>TOTAL (ZAR)</th>
          <th>STATUS</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
  <AnimatePresence>
    {filteredOrders.length > 0 ? (
      filteredOrders.map(o => (
        <motion.tr
          key={o.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <td className="order-id">{o.displayId}</td>
          <td>{o.dateOfOrder ? new Date(o.dateOfOrder).toLocaleDateString() : 'N/A'}</td>
          <td>{o.product?.name || 'N/A'}</td>
          <td>{o.amount}</td>
          <td>{o.total}</td>
          <td>
            <motion.span
              key={o.status}
              className={`status-badge ${o.status.toLowerCase()}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {o.status}
            </motion.span>
          </td>
          <td>
            <button className="edit-btn" onClick={() => openEditOrderModal(o)}>Edit</button>
            <button className="delete-btn" onClick={() => confirmDeleteOrder(o.id)}>Delete</button>
          </td>
        </motion.tr>
      ))
    ) : (
      <tr style={{ height: '100px' }}>
        <td colSpan="7" style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic', fontSize: '1.2em' }}>
          No Orders Found
        </td>
      </tr>
    )}
  </AnimatePresence>
</tbody>
    </table>
  </div>
</section>

      </div>

      {/* ----- MODALS ----- */}
      
        {/* Product Delete */}
        {deleteModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this product?</p>
              <div className="modal-actions">
                <button className="cancel-btn modal-btn" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                <button className="delete-confirm-btn modal-btn" onClick={handleDeleteProduct}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Product Delete Error */}
        {deleteErrorModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }}>
              <h3>Cannot Delete Product</h3>
              <p>{deleteErrorMessage}</p>
              <div className="modal-actions">
                <button className="cancel-btn modal-btn" onClick={() => setDeleteErrorModalOpen(false)}>OK</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Product Edit */}
        {editModalOpen && productToEdit && (
  <motion.div className="edit-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className="edit-modal-box" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }}>
      <h3>Edit | {productToEdit.prodCode || productToEdit.id}</h3>
      <div className="modal-divider"></div>
      <div className="edit-field">
        <label>Name:</label>
        <input value={productToEdit.name} onChange={e => handleEditChange('name', e.target.value)} />
      </div>
      <div className="edit-field">
        <label>Price:</label>
        <input value={productToEdit.price} onChange={e => handleEditChange('price', e.target.value)} />
      </div>
      <div className="edit-field">
        <label>Stock:</label>
        <input value={productToEdit.stock} onChange={e => handleEditChange('stock', e.target.value)} />
      </div>
      <div className="edit-modal-actions">
        <button className="cancel-btn modal-btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
        <button className="save-btn modal-btn" onClick={handleSaveEdit}>Save</button>
      </div>
    </motion.div>
  </motion.div>
)}


        {/* Order Edit */}
{editOrderModalOpen && orderToEdit && (
  <motion.div
    className="edit-modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="edit-modal-box"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h3>Edit Order</h3>
      <div className="modal-divider"></div>

      <div className="edit-field">
        <label>Amount:</label>
        <input
          type="number"
          value={orderToEdit.amount}
          readOnly
        />
      </div>

      <div className="edit-field">
        <label>Status:</label>
        <select
          value={orderToEdit.status}
          onChange={e => handleEditOrderChange('status', e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="edit-modal-actions">
        <button
          className="cancel-btn modal-btn"
          onClick={() => setEditOrderModalOpen(false)}
        >
          Cancel
        </button>
        <button className="save-btn modal-btn" onClick={handleSaveOrderEdit}>
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

        {/* Order Delete */}
        {deleteOrderModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this order?</p>
              <div className="modal-actions">
                <button className="cancel-btn modal-btn" onClick={() => setDeleteOrderModalOpen(false)}>Cancel</button>
                <button className="delete-confirm-btn modal-btn" onClick={handleDeleteOrder}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
    </div>
  );
}

export default Dashboard;
