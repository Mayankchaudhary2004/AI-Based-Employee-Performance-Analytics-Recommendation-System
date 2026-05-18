const Employee = require('../models/Employee');

/**
 * @route   POST /api/employees
 * @desc    Add a new employee
 * @access  Protected
 */
const addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check duplicate email
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this email already exists',
      });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
    });

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee,
    });
  } catch (error) {
    console.error('Add Employee Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

/**
 * @route   GET /api/employees
 * @desc    Get all employees (sorted by performance score desc)
 * @access  Protected
 */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    // Assign rankings based on performance score
    const ranked = employees.map((emp, idx) => ({
      ...emp.toObject(),
      ranking: idx + 1,
    }));

    res.json({
      success: true,
      count: ranked.length,
      employees: ranked,
    });
  } catch (error) {
    console.error('Get Employees Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

/**
 * @route   GET /api/employees/:id
 * @desc    Get a single employee by ID
 * @access  Protected
 */
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

/**
 * @route   GET /api/employees/search
 * @desc    Search employees by department, name, or skill
 * @access  Protected
 * @query   department, name, skill, minScore, maxScore
 */
const searchEmployees = async (req, res) => {
  try {
    const { department, name, skill, minScore, maxScore } = req.query;
    const query = {};

    if (department) query.department = department;
    if (name) query.name = { $regex: name, $options: 'i' };
    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };
    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = Number(minScore);
      if (maxScore) query.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(query).sort({ performanceScore: -1 });

    res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error('Search Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee details
 * @access  Protected
 */
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete an employee
 * @access  Protected
 */
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
};
