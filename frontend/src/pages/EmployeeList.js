import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI } from '../api/api';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['', 'Development', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'QA'];

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', department: '', skill: '', minScore: '', maxScore: '' });
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchEmployees = async (filters = {}) => {
    setLoading(true);
    try {
      const hasFilters = Object.values(filters).some((v) => v !== '');
      const res = hasFilters
        ? await employeeAPI.search(filters)
        : await employeeAPI.getAll();
      setEmployees(res.data.employees);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(Object.entries(search).filter(([, v]) => v !== ''));
    fetchEmployees(cleanFilters);
  };

  const handleReset = () => {
    setSearch({ name: '', department: '', skill: '', minScore: '', maxScore: '' });
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    try {
      await employeeAPI.delete(id);
      toast.success('Employee removed successfully');
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to delete employee');
    }
  };

  const openEdit = (emp) => {
    setEditModal(emp._id);
    setEditData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      performanceScore: emp.performanceScore,
      experience: emp.experience,
      skills: emp.skills,
    });
  };

  const handleEditSave = async () => {
    try {
      await employeeAPI.update(editModal, {
        ...editData,
        performanceScore: Number(editData.performanceScore),
        experience: Number(editData.experience),
      });
      toast.success('Employee updated successfully! ✅');
      setEditModal(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Employee List</h1>
          <p className="subtitle">{employees.length} employee(s) in the system</p>
        </div>
        <Link to="/add-employee" className="btn-primary" id="add-new-emp-btn">
          + Add Employee
        </Link>
      </div>

      {/* Search & Filter Section */}
      <div className="search-card" id="search-filter-section">
        <form onSubmit={handleSearch} id="employee-search-form">
          <div className="search-grid">
            <div className="form-group">
              <label htmlFor="search-name">Search by Name</label>
              <input
                id="search-name"
                type="text"
                placeholder="e.g. Aman"
                value={search.name}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="search-dept">Department</label>
              <select
                id="search-dept"
                value={search.department}
                onChange={(e) => setSearch({ ...search, department: e.target.value })}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d || 'All Departments'}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="search-skill">Skill</label>
              <input
                id="search-skill"
                type="text"
                placeholder="e.g. React"
                value={search.skill}
                onChange={(e) => setSearch({ ...search, skill: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="search-min-score">Min Score</label>
              <input
                id="search-min-score"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={search.minScore}
                onChange={(e) => setSearch({ ...search, minScore: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="search-max-score">Max Score</label>
              <input
                id="search-max-score"
                type="number"
                min="0"
                max="100"
                placeholder="100"
                value={search.maxScore}
                onChange={(e) => setSearch({ ...search, maxScore: e.target.value })}
              />
            </div>
          </div>
          <div className="search-actions">
            <button id="search-submit-btn" type="submit" className="btn-primary">🔍 Search</button>
            <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>

      {/* Employee Table */}
      {loading ? (
        <div className="loading-screen"><div className="spinner"></div><p>Loading employees...</p></div>
      ) : employees.length === 0 ? (
        <div className="empty-state card">
          <p>No employees found. <Link to="/add-employee">Add the first one →</Link></p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table" id="employees-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Skills</th>
                  <th>Score</th>
                  <th>Exp.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp._id}>
                    <td><span className="rank-badge">#{idx + 1}</span></td>
                    <td>
                      <div className="emp-name-cell">
                        <div className="emp-avatar">{emp.name.charAt(0)}</div>
                        {emp.name}
                      </div>
                    </td>
                    <td className="email-cell">{emp.email}</td>
                    <td><span className="dept-badge">{emp.department}</span></td>
                    <td>
                      <div className="skills-mini">
                        {emp.skills.slice(0, 3).map((s) => (
                          <span key={s} className="skill-mini-tag">{s}</span>
                        ))}
                        {emp.skills.length > 3 && <span className="skill-mini-tag muted">+{emp.skills.length - 3}</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`performance-badge ${emp.performanceScore >= 85 ? 'top' : emp.performanceScore >= 70 ? 'good' : emp.performanceScore >= 50 ? 'avg' : 'low'}`}>
                        {emp.performanceScore}%
                      </span>
                    </td>
                    <td>{emp.experience} yrs</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-icon edit"
                          onClick={() => openEdit(emp)}
                          title="Edit"
                          id={`edit-btn-${emp._id}`}
                        >✏️</button>
                        <button
                          className="btn-icon delete"
                          onClick={() => setDeleteConfirm(emp)}
                          title="Delete"
                          id={`delete-btn-${emp._id}`}
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} id="edit-employee-modal">
            <h3>Edit Employee</h3>
            <div className="form-group">
              <label>Name</label>
              <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Performance Score</label>
              <input type="number" min="0" max="100" value={editData.performanceScore} onChange={(e) => setEditData({ ...editData, performanceScore: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input type="number" min="0" value={editData.experience} onChange={(e) => setEditData({ ...editData, experience: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleEditSave} id="save-edit-btn">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal danger-modal" onClick={(e) => e.stopPropagation()} id="delete-confirm-modal">
            <h3>🗑️ Delete Employee</h3>
            <p>Are you sure you want to remove <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm._id)} id="confirm-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
