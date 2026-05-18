const mongoose = require('mongoose');

/**
 * Employee Schema
 * Stores employee details including performance metrics and skills
 */
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Development', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'QA'],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Skills array must have at least one skill',
      },
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'],
      min: [0, 'Performance score cannot be below 0'],
      max: [100, 'Performance score cannot exceed 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot exceed 50 years'],
    },
    aiRecommendation: {
      type: String,
      default: null,
    },
    ranking: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for search performance
employeeSchema.index({ department: 1 });
employeeSchema.index({ performanceScore: -1 });
employeeSchema.index({ email: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
