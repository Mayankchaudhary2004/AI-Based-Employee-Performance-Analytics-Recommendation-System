const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateEmployee,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');

// Apply auth protection to all employee routes
router.use(protect);

// @route  GET  /api/employees/search
router.get('/search', searchEmployees);

// @route  GET  /api/employees
router.get('/', getAllEmployees);

// @route  POST /api/employees
router.post('/', validateEmployee, handleValidationErrors, addEmployee);

// @route  GET  /api/employees/:id
router.get('/:id', getEmployeeById);

// @route  PUT  /api/employees/:id
router.put('/:id', updateEmployee);

// @route  DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

module.exports = router;
