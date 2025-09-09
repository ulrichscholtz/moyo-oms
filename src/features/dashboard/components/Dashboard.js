import React, { useState } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([
        { name: 'Laptop', price: '999,95', stock: 20 },
        { name: 'Headphones', price: '199,95', stock: 50 },
        { name: 'Keyboard', price: '89,95', stock: 30 }
    ]);
    const [orders] = useState([
        { id: '0-1001', product: 'Laptop', status: 'Allocated', total: 'R999.95' },
        { id: '0-1002', product: 'Headphones', status: 'Pending', total: 'R199.95' }
    ]);

    const handleProductChange = (index, field, value) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(open => !open);

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
            navigate("/login"); // redirect to login page
        }
    };

    return (
        <div className="dashboard-container">
            <button
                className="sidebar-toggle-btn"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                style={{
                    position: 'absolute',
                    left: sidebarOpen ? 220 : 10,
                    top: 20,
                    zIndex: 1000
                }}
            >
                {sidebarOpen ? '⟨' : '⟩'}
            </button>
            <aside
                className="dashboard-sidebar"
                style={{
                    display: sidebarOpen ? 'block' : 'none'
                }}
            >
                <h2>Menu</h2>
                <ul>
                    <li>Dashboard</li>
                    <li>Products</li>
                    <li>Orders</li>
                    <li>Settings</li>
                    <li onClick={handleLogout}>Logout</li>
                </ul>
            </aside>
            <div
                className="dashboard-main"
                style={{
                    marginLeft: sidebarOpen ? 220 : 0,
                    transition: 'margin-left 0.2s'
                }}
            >
                <h1 className="dashboard-title">Vendor Dashboard</h1>
                <div className="dashboard-subtitle">
                    Signed in as <span className="dashboard-email">vendor@moyo.example</span>
                </div>

                <section className="manage-products-section">
                    <h2>Manage Products</h2>
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
                                    <tr key={p.name}>
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
                                            <button className="edit-btn">Edit</button>
                                            <button className="delete-btn">Delete</button>
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