import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

export default function Dashboard() {
  const { logout, authHeader } = useAuth();
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');

  // Table/Pagination State
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCategoryPage, setIsCategoryPage] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Food');
  const [paginationInfo, setPaginationInfo] = useState({ first: true, last: true });

  // Metrics & Chart States
  const [totalAmount, setTotalAmount] = useState(0);
  const [topCategory, setTopCategory] = useState('');
  const [pieData, setPieData] = useState({ labels: [], values: [] });
  const [barData, setBarData] = useState({ labels: [], values: [] });

  const pageSize = 5;

  const loadExpenses = useCallback(async () => {
    try {
      const url = isCategoryPage 
        ? `/expenses/category/${filterCategory}?page=${currentPage}&size=${pageSize}`
        : `/expenses/?page=${currentPage}&size=${pageSize}`;

      const res = await fetch(url, { headers: authHeader() });
      const data = await res.json();
      
      setExpenses(data.content || []);
      setPaginationInfo({ first: data.first, last: data.last });
    } catch (err) {
      console.error(err);
    }
  }, [currentPage, isCategoryPage, filterCategory, authHeader]);

  const loadMetricsAndCharts = useCallback(async () => {
    try {
      // Total Spent
      const totalRes = await fetch('/expenses/total-spent', { headers: authHeader() });
      const totalData = await totalRes.json();
      setTotalAmount(totalData);

      // Top Category
      const topRes = await fetch('/expenses/top-category', { headers: authHeader() });
      const topData = await topRes.json();
      const entries = Object.entries(topData);
      if (entries.length > 0) {
        setTopCategory(`${entries[0][0]} with amount: ${entries[0][1]}`);
      }

      // Pie Chart Data
      const pieRes = await fetch('/expenses/category-summary', { headers: authHeader() });
      const pieJson = await pieRes.json();
      setPieData({ labels: Object.keys(pieJson), values: Object.values(pieJson) });

      // Bar Chart Data
      const currDate = new Date();
      const barRes = await fetch(`/expenses/monthly-summary/${currDate.getFullYear()}/${currDate.getMonth() + 1}`, { headers: authHeader() });
      const barJson = await barRes.json();
      setBarData({ labels: Object.keys(barJson), values: Object.values(barJson) });

    } catch (err) {
      console.error(err);
    }
  }, [authHeader]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    loadMetricsAndCharts();
  }, [loadMetricsAndCharts]);

  const handleAddExpense = async () => {
    try {
      await fetch('/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ title, amount, category, date })
      });
      alert('Expense Added Successfully');
      setTitle(''); setAmount(''); setDate('');
      loadExpenses();
      loadMetricsAndCharts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await fetch(`/expenses/${id}`, { method: 'DELETE', headers: authHeader() });
      alert('Expense deleted successfully');
      loadExpenses();
      loadMetricsAndCharts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="header">
        <h2>Expense Tracker</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="container">
        {/* Add Expense Card */}
        <div className="card">
          <h3>Add Expense</h3>
          <input type="text" placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
          <input type="number" placeholder="amount" value={amount} onChange={e => setAmount(e.target.value)} />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Miscellaneous</option>
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <button onClick={handleAddExpense}>Add</button>
        </div>

        {/* View / Table Card */}
        <div className="card">
          <h4>Fetch Expenses by Category:</h4>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Miscellaneous</option>
          </select>
          <button onClick={() => { setCurrentPage(0); setIsCategoryPage(true); }}>Load Expenses</button>
          <button onClick={() => { setCurrentPage(0); setIsCategoryPage(false); }} style={{ marginLeft: '10px' }}>Load All Expenses</button>

          <h3>Your Expenses</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>{exp.amount}</td>
                  <td>{exp.category}</td>
                  <td>{exp.date}</td>
                  <td>
                    <button onClick={() => handleDeleteExpense(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '10px' }}>
            <button disabled={paginationInfo.first} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
            <span style={{ margin: '0 15px' }}>{currentPage + 1}</span>
            <button disabled={paginationInfo.last} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="card">
          <table className="noboarder">
            <tbody>
              <tr>
                <td>Total Expenses Amount:</td>
                <td><strong>{totalAmount}</strong></td>
              </tr>
              <tr>
                <td>Top Spent Category:</td>
                <td><strong>{topCategory || 'N/A'}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual Charts Display Section */}
        <div className="card">
          <div className="chart-container">
            <div>
              <h3>Expenses by Category</h3>
              <div className="chart-box">
                <PieChart labels={pieData.labels} values={pieData.values} />
              </div>
            </div>
            <div>
              <h3>Monthly Expenses</h3>
              <div className="chart-box">
                <BarChart labels={barData.labels} values={barData.values} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}