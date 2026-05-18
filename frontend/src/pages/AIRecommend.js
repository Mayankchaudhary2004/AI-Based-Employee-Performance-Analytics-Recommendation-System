import React, { useEffect, useState } from 'react';
import { employeeAPI, aiAPI } from '../api/api';
import toast from 'react-hot-toast';

const AIRecommend = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [recommendation, setRecommendation] = useState('');
  const [analyzedEmployees, setAnalyzedEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeAPI.getAll();
        setEmployees(res.data.employees);
      } catch {
        toast.error('Failed to load employees');
      } finally {
        setFetching(false);
      }
    };
    fetchEmployees();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAnalyzeAll = async () => {
    setLoading(true);
    setRecommendation('');
    try {
      const res = await aiAPI.getRecommendation({ employeeIds: [] });
      setRecommendation(res.data.recommendation);
      setAnalyzedEmployees(res.data.employees || []);
      toast.success(`AI analyzed ${res.data.analyzedCount} employee(s)! 🤖`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSelected = async () => {
    if (selected.length === 0) return toast.error('Please select at least one employee');
    setLoading(true);
    setRecommendation('');
    try {
      const res = await aiAPI.getRecommendation({ employeeIds: selected });
      setRecommendation(res.data.recommendation);
      setAnalyzedEmployees(res.data.employees || []);
      toast.success(`AI analyzed ${res.data.analyzedCount} employee(s)! 🤖`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // Format AI response into readable sections
  const formatRecommendation = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h4 key={i} className="ai-section-title">{line.replace(/\*\*/g, '')}</h4>;
        }
        if (line.startsWith('**')) {
          return <p key={i} className="ai-bold" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <li key={i}>{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\./)) {
          return <p key={i} className="ai-numbered">{line}</p>;
        }
        if (line.trim() === '') return <br key={i} />;
        return <p key={i}>{line}</p>;
      });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>🤖 AI Recommendations</h1>
          <p className="subtitle">Powered by OpenRouter/GPT — get intelligent insights for your team</p>
        </div>
      </div>

      {/* AI Feature Cards */}
      <div className="ai-features-grid">
        {[
          { icon: '🚀', title: 'Promotion Recommendations', desc: 'AI identifies top candidates for promotion based on performance metrics' },
          { icon: '📚', title: 'Training Suggestions', desc: 'Personalized learning paths and skill enhancement recommendations' },
          { icon: '💬', title: 'AI Feedback', desc: 'Constructive feedback and improvement areas for each employee' },
          { icon: '🎯', title: 'Employee Rankings', desc: 'AI-powered ranking with detailed justifications' },
        ].map((f) => (
          <div key={f.title} className="ai-feature-card">
            <div className="ai-feature-icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="ai-panel">
        {/* Employee Selection */}
        <div className="ai-select-section">
          <div className="ai-select-header">
            <h3>Select Employees to Analyze</h3>
            <div className="ai-select-actions">
              <button
                className="btn-secondary small"
                onClick={() => setSelected(employees.map((e) => e._id))}
              >
                Select All
              </button>
              <button className="btn-secondary small" onClick={() => setSelected([])}>
                Clear
              </button>
            </div>
          </div>

          {fetching ? (
            <div className="loading-screen mini"><div className="spinner"></div></div>
          ) : (
            <div className="employee-select-grid">
              {employees.map((emp) => (
                <div
                  key={emp._id}
                  className={`employee-select-card ${selected.includes(emp._id) ? 'selected' : ''}`}
                  onClick={() => toggleSelect(emp._id)}
                  id={`select-emp-${emp._id}`}
                >
                  <div className="select-check">{selected.includes(emp._id) ? '✓' : ''}</div>
                  <div className="emp-avatar small">{emp.name.charAt(0)}</div>
                  <div className="emp-select-info">
                    <strong>{emp.name}</strong>
                    <span>{emp.department} • {emp.performanceScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="ai-analyze-buttons">
            <button
              id="analyze-selected-btn"
              className="btn-primary"
              onClick={handleAnalyzeSelected}
              disabled={loading || selected.length === 0}
            >
              {loading ? <><span className="btn-spinner"></span> Analyzing...</> : `🔍 Analyze Selected (${selected.length})`}
            </button>
            <button
              id="analyze-all-btn"
              className="btn-secondary"
              onClick={handleAnalyzeAll}
              disabled={loading || employees.length === 0}
            >
              {loading ? '...' : `🤖 Analyze All (${employees.length})`}
            </button>
          </div>
        </div>

        {/* AI Output */}
        {loading && (
          <div className="ai-loading">
            <div className="ai-loading-animation">
              <div className="ai-dot"></div>
              <div className="ai-dot"></div>
              <div className="ai-dot"></div>
            </div>
            <p>AI is analyzing employee performance data...</p>
            <span className="ai-model-tag">Powered by OpenRouter GPT</span>
          </div>
        )}

        {recommendation && !loading && (
          <div className="ai-result-section" id="ai-recommendation-output">
            <div className="ai-result-header">
              <div>
                <h3>🤖 AI Analysis Results</h3>
                <p>Analyzed {analyzedEmployees.length} employee(s)</p>
              </div>
              <span className="ai-model-tag">GPT via OpenRouter</span>
            </div>
            <div className="ai-result-content">
              <ul className="ai-result-list">
                {formatRecommendation(recommendation)}
              </ul>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(recommendation);
                toast.success('Copied to clipboard!');
              }}
            >
              📋 Copy Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommend;
