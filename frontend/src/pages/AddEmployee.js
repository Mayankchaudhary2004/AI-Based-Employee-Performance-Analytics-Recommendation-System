import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../api/api';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'QA'];
const SKILL_SUGGESTIONS = ['React', 'Node.js', 'MongoDB', 'Python', 'Java', 'AWS', 'Docker', 'SQL', 'TypeScript', 'Angular', 'Vue.js', 'GraphQL', 'Redis', 'Kubernetes', 'Machine Learning'];

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: [],
    performanceScore: '',
    experience: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData({ ...formData, skills: [...formData.skills, trimmed] });
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      return toast.error('Please add at least one skill');
    }
    setLoading(true);
    try {
      await employeeAPI.create({
        ...formData,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
      });
      toast.success('Employee added successfully! 🎉');
      navigate('/employees');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add employee';
      const errors = err.response?.data?.errors;
      if (errors) {
        errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Add New Employee</h1>
          <p className="subtitle">Register a new team member to the system</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/employees')}>
          ← Back
        </button>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} id="add-employee-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="emp-name">Full Name *</label>
              <input
                id="emp-name"
                type="text"
                name="name"
                placeholder="e.g. Aman Verma"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emp-email">Email Address *</label>
              <input
                id="emp-email"
                type="email"
                name="email"
                placeholder="e.g. aman@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emp-department">Department *</label>
              <select
                id="emp-department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="emp-experience">Years of Experience *</label>
              <input
                id="emp-experience"
                type="number"
                name="experience"
                placeholder="e.g. 3"
                min="0"
                max="50"
                step="0.5"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="emp-score">Performance Score (0–100) *</label>
              <div className="score-input-wrapper">
                <input
                  id="emp-score"
                  type="range"
                  name="performanceScore"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.performanceScore || 50}
                  onChange={handleChange}
                  className="range-input"
                />
                <input
                  type="number"
                  name="performanceScore"
                  min="0"
                  max="100"
                  placeholder="85"
                  value={formData.performanceScore}
                  onChange={handleChange}
                  className="score-number"
                  required
                />
              </div>
              {formData.performanceScore && (
                <div className={`score-label ${Number(formData.performanceScore) >= 85 ? 'top' : Number(formData.performanceScore) >= 70 ? 'good' : Number(formData.performanceScore) >= 50 ? 'avg' : 'low'}`}>
                  {Number(formData.performanceScore) >= 85
                    ? '🏆 Top Performer'
                    : Number(formData.performanceScore) >= 70
                    ? '⭐ Good Performer'
                    : Number(formData.performanceScore) >= 50
                    ? '📈 Average Performer'
                    : '⚠️ Needs Improvement'}
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="skill-input">Skills *</label>
              <div className="skills-input-area">
                <div className="skills-tags">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>×</button>
                    </span>
                  ))}
                  <input
                    id="skill-input"
                    type="text"
                    placeholder="Type skill and press Enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                  />
                </div>
              </div>
              <div className="skill-suggestions">
                {SKILL_SUGGESTIONS.filter((s) => !formData.skills.includes(s)).slice(0, 8).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="skill-suggestion-btn"
                    onClick={() => addSkill(s)}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/employees')}>
              Cancel
            </button>
            <button id="submit-employee-btn" type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner"></span> : '✅ Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
