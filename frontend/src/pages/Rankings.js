import React, { useEffect, useState } from 'react';
import { aiAPI } from '../api/api';
import toast from 'react-hot-toast';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await aiAPI.getRankings();
        setRankings(res.data.rankings);
      } catch (err) {
        toast.error('Failed to load rankings');
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  const getBadgeClass = (score) => {
    if (score >= 85) return 'top';
    if (score >= 70) return 'good';
    if (score >= 50) return 'avg';
    return 'low';
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading rankings...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>🏆 Employee Rankings</h1>
          <p className="subtitle">Performance-based leaderboard — updated in real time</p>
        </div>
      </div>

      {rankings.length === 0 ? (
        <div className="empty-state card">
          <p>No employee data available for ranking. Add employees first.</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {rankings.length >= 3 && (
            <div className="podium-section">
              {/* 2nd place */}
              <div className="podium-card silver">
                <div className="podium-medal">🥈</div>
                <div className="podium-avatar">{rankings[1].name.charAt(0)}</div>
                <h4>{rankings[1].name}</h4>
                <p>{rankings[1].department}</p>
                <div className="podium-score">{rankings[1].performanceScore}%</div>
              </div>
              {/* 1st place */}
              <div className="podium-card gold">
                <div className="podium-medal">🥇</div>
                <div className="podium-avatar champion">{rankings[0].name.charAt(0)}</div>
                <h4>{rankings[0].name}</h4>
                <p>{rankings[0].department}</p>
                <div className="podium-score">{rankings[0].performanceScore}%</div>
              </div>
              {/* 3rd place */}
              <div className="podium-card bronze">
                <div className="podium-medal">🥉</div>
                <div className="podium-avatar">{rankings[2].name.charAt(0)}</div>
                <h4>{rankings[2].name}</h4>
                <p>{rankings[2].department}</p>
                <div className="podium-score">{rankings[2].performanceScore}%</div>
              </div>
            </div>
          )}

          {/* Full Rankings Table */}
          <div className="table-card">
            <h3>Full Leaderboard</h3>
            <div className="table-wrapper">
              <table className="data-table" id="rankings-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Skills</th>
                    <th>Experience</th>
                    <th>Score</th>
                    <th>Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((emp) => (
                    <tr key={emp.id} className={emp.rank <= 3 ? 'highlight-row' : ''}>
                      <td>
                        <span className="rank-medal">{getMedal(emp.rank)}</span>
                      </td>
                      <td>
                        <div className="emp-name-cell">
                          <div className={`emp-avatar ${emp.rank === 1 ? 'champion' : ''}`}>
                            {emp.name.charAt(0)}
                          </div>
                          {emp.name}
                        </div>
                      </td>
                      <td><span className="dept-badge">{emp.department}</span></td>
                      <td>
                        <div className="skills-mini">
                          {emp.skills.slice(0, 3).map((s) => (
                            <span key={s} className="skill-mini-tag">{s}</span>
                          ))}
                          {emp.skills.length > 3 && (
                            <span className="skill-mini-tag muted">+{emp.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td>{emp.experience} yrs</td>
                      <td>
                        <div className="score-bar-wrapper">
                          <div className="score-bar" style={{ width: `${emp.performanceScore}%` }}></div>
                          <span>{emp.performanceScore}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`performance-badge ${getBadgeClass(emp.performanceScore)}`}>
                          {emp.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Rankings;
