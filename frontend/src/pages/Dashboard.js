import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

const Dashboard = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeAPI.getAll();
        setEmployees(res.data.employees);
      } catch (err) {
        toast.error('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Compute stats
  const avgScore = employees.length
    ? (employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length).toFixed(1)
    : 0;

  const topPerformers = employees.filter((e) => e.performanceScore >= 85).length;
  const needsImprovement = employees.filter((e) => e.performanceScore < 50).length;

  // Department distribution for Pie Chart
  const deptMap = {};
  employees.forEach((e) => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

  // Bar chart: top 6 employees by performance
  const barData = [...employees]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 6)
    .map((e) => ({ name: e.name.split(' ')[0], score: e.performanceScore }));

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: '👥', color: '#6366f1' },
    { label: 'Avg. Performance', value: `${avgScore}%`, icon: '📊', color: '#8b5cf6' },
    { label: 'Top Performers', value: topPerformers, icon: '🏆', color: '#10b981' },
    { label: 'Needs Improvement', value: needsImprovement, icon: '⚠️', color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="subtitle">Here's your team performance overview</p>
        </div>
        <div className="header-actions">
          <Link to="/add-employee" id="add-emp-btn" className="btn-primary">
            + Add Employee
          </Link>
          <Link to="/ai-recommend" id="ai-insights-btn" className="btn-secondary">
            🤖 AI Insights
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label} style={{ borderColor: stat.color }}>
            <div className="stat-icon" style={{ background: stat.color + '22' }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {employees.length > 0 && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Top Performers</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis domain={[0, 100]} stroke="#aaa" />
                <Tooltip
                  contentStyle={{ background: '#1e1e2e', border: '1px solid #6366f1', borderRadius: '8px' }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Department Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #8b5cf6', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Employees Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Recent Employees</h3>
          <Link to="/employees" className="btn-link">View All →</Link>
        </div>
        {employees.length === 0 ? (
          <div className="empty-state">
            <p>No employees yet. <Link to="/add-employee">Add your first employee →</Link></p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table" id="dashboard-employees-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Score</th>
                  <th>Experience</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map((emp, idx) => (
                  <tr key={emp._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="emp-name-cell">
                        <div className="emp-avatar">{emp.name.charAt(0)}</div>
                        {emp.name}
                      </div>
                    </td>
                    <td><span className="dept-badge">{emp.department}</span></td>
                    <td>
                      <div className="score-bar-wrapper">
                        <div className="score-bar" style={{ width: `${emp.performanceScore}%` }}></div>
                        <span>{emp.performanceScore}%</span>
                      </div>
                    </td>
                    <td>{emp.experience} yrs</td>
                    <td>
                      <span className={`performance-badge ${emp.performanceScore >= 85 ? 'top' : emp.performanceScore >= 70 ? 'good' : emp.performanceScore >= 50 ? 'avg' : 'low'}`}>
                        {emp.performanceScore >= 85 ? '🏆 Top' : emp.performanceScore >= 70 ? '⭐ Good' : emp.performanceScore >= 50 ? '📈 Avg' : '⚠️ Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
