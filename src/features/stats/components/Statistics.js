import React, { useEffect, useState } from 'react';
import '../styles/Statistics.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { MdOutlineDashboard } from "react-icons/md";
import { FaChartBar } from "react-icons/fa";
import { FiMenu, FiSettings, FiLogOut, FiShoppingBag, FiPieChart } from "react-icons/fi";

function Statistics() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch products
    fetch(`${API_URL}/products?userId=${user.userId}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));

    // Fetch orders safely
    fetch(`${API_URL}/orders?userId=${user.userId}`)
      .then(res => res.json())
      .then(data => {
        const safeOrders = data.map(o => ({
          ...o,
          dateOfOrder: o.dateOfOrder ? new Date(o.dateOfOrder).toISOString() : null,
          total: o.total || 0
        }));
        setOrders(safeOrders);
      })
      .catch(err => console.error(err));
  }, [navigate]);

  // Revenue aggregation using actual order date
  const revenueByDate = orders.reduce((acc, order) => {
    if (!order.dateOfOrder) return acc; // skip if missing
    const dateObj = new Date(order.dateOfOrder);
    if (isNaN(dateObj)) return acc;

    const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!acc[date]) acc[date] = 0;
    acc[date] += order.total;
    return acc;
  }, {});

  const revenueData = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const toggleSidebar = () => setSidebarOpen(open => !open);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('loggedInUser');
      navigate("/login");
    }
  };

// Aggregate product sales
const productSales = {};

orders.forEach(order => {
  const prod = order.product || products.find(p => p.id === order.productId);
  if (!prod) return;
  
  if (!productSales[prod.id]) productSales[prod.id] = { name: prod.name, quantity: 0 };
  productSales[prod.id].quantity += order.amount || 0;
});

const topProductsData = Object.values(productSales)
  .filter(p => p.quantity > 0)
  .sort((a, b) => b.quantity - a.quantity)
  .slice(0, 5);

// Function to generate shades of a base color
const generateShades = (baseColor, count) => {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const factor = 0.5 + (i / (count * 2)); // adjust brightness from 50% to ~100%
    const color = baseColor
      .match(/\w\w/g)
      .map((c) => Math.round(parseInt(c, 16) * factor).toString(16).padStart(2, '0'))
      .join('');
    shades.push(`#${color}`);
  }
  return shades;
};

const COLORS = generateShades('00b894', topProductsData.length);

  return (
    <div className="dashboard-container">
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        style={{ position: 'absolute', left: sidebarOpen ? 220 : 10, top: 20, zIndex: 1000 }}
      >
        {sidebarOpen ? '⟨' : '⟩'}
      </button>

      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{ display: sidebarOpen ? 'block' : 'none' }}>
        <h2><FiMenu />Menu</h2>
        <ul>
          <li onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}><MdOutlineDashboard />Dashboard</li>
          <li onClick={() => navigate('/statistics')} style={{ cursor: 'pointer' }}><FaChartBar />Statistics</li>
          <li><FiSettings />Settings</li>
          <li onClick={handleLogout}><FiLogOut />Logout</li>
        </ul>
      </aside>

      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? 220 : 0, transition: 'margin-left 0.2s' }}>
        <h1 className="dashboard-title"><FiPieChart style={{ marginRight: '8px', verticalAlign: 'middle' }} />Statistics</h1>
        <div className="dashboard-subtitle">Overview of your products and orders (last 30 days)</div>

        <div className="stats-cards">
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </motion.div>

          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3>Total Stock (All Products)</h3>
            <p>{products.reduce((sum, product) => sum + (product.stock || 0), 0)}</p>
            </motion.div>

          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </motion.div>

          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3>Total Products Sold</h3>
            <p>
            {orders.reduce((sum, order) => sum + (order.amount || 0), 0)}
            </p>
            </motion.div>


          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3>Total Revenue (ZAR)</h3>
            <p>{totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </motion.div>
        </div>

        <section className="charts-section">
  <div className="charts-row">
    <div className="chart-container">
      <h2>Revenue Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip labelFormatter={date => new Date(date).toLocaleDateString()} />
          <Line type="monotone" dataKey="revenue" stroke="#00b894" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="chart-container">
      <h2>Top Selling Products</h2>
      {topProductsData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={topProductsData}
              dataKey="quantity"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={170} // reduced from 200
              label
            >
              {topProductsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} sold`} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '300px'  // adjust height to match your chart area
}}>
  <p style={{ 
    color: '#6b7280', 
    fontStyle: 'italic', 
    fontSize: '1.2rem', 
    textAlign: 'center' 
  }}>
    No Sales Data Available
  </p>
</div>
      )}
    </div>
  </div>
</section>
      </div>
    </div>
  );
}

export default Statistics;
