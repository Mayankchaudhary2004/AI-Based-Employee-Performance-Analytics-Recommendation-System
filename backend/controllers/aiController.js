const axios = require('axios');
const Employee = require('../models/Employee');

/**
 * Build a detailed prompt for AI recommendation
 */
const buildPrompt = (employees) => {
  const employeeData = employees
    .map(
      (e, i) =>
        `${i + 1}. Name: ${e.name}, Department: ${e.department}, Skills: [${e.skills.join(', ')}], Performance Score: ${e.performanceScore}/100, Experience: ${e.experience} years`
    )
    .join('\n');

  return `You are an expert HR analytics AI assistant. Analyze the following employee performance data and provide detailed, actionable recommendations.

EMPLOYEE DATA:
${employeeData}

For each employee, provide:
1. **Performance Assessment**: Brief assessment of their current standing
2. **Promotion Recommendation**: Should they be promoted? Why?
3. **Training Suggestions**: Specific skills or courses they should pursue
4. **AI Feedback**: Constructive feedback to improve performance
5. **Overall Ranking**: Rank employees from highest to lowest potential

Format your response in a clear, structured way. Be specific and professional.`;
};

/**
 * @route   POST /api/ai/recommend
 * @desc    Generate AI-powered recommendations for employee(s)
 * @access  Protected
 * @body    { employeeIds: [] } - optional; if empty, uses all employees
 */
const getRecommendation = async (req, res) => {
  try {
    const { employeeIds } = req.body;

    let employees;
    if (employeeIds && employeeIds.length > 0) {
      employees = await Employee.find({ _id: { $in: employeeIds } });
    } else {
      employees = await Employee.find().sort({ performanceScore: -1 });
    }

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No employees found to analyze',
      });
    }

    const prompt = buildPrompt(employees);

    // Call OpenRouter API (OpenAI-compatible)
    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert HR analytics AI that provides insightful employee performance recommendations, promotion decisions, and training plans.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Employee Performance Analytics',
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    // Save recommendation to each employee record
    for (const emp of employees) {
      await Employee.findByIdAndUpdate(emp._id, { aiRecommendation: aiText });
    }

    res.json({
      success: true,
      recommendation: aiText,
      analyzedCount: employees.length,
      employees: employees.map((e) => ({ id: e._id, name: e.name })),
    });
  } catch (error) {
    console.error('AI Recommendation Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'AI service error: ' + (error.response?.data?.error?.message || error.message),
    });
  }
};

/**
 * @route   GET /api/ai/rankings
 * @desc    Get AI-powered employee rankings
 * @access  Protected
 */
const getEmployeeRankings = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    const ranked = employees.map((emp, idx) => ({
      rank: idx + 1,
      id: emp._id,
      name: emp.name,
      department: emp.department,
      performanceScore: emp.performanceScore,
      experience: emp.experience,
      skills: emp.skills,
      badge:
        emp.performanceScore >= 85
          ? '🏆 Top Performer'
          : emp.performanceScore >= 70
          ? '⭐ Good Performer'
          : emp.performanceScore >= 50
          ? '📈 Average Performer'
          : '⚠️ Needs Improvement',
    }));

    res.json({ success: true, rankings: ranked });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

module.exports = { getRecommendation, getEmployeeRankings };
