const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  duration: Number,
});

const Course = mongoose.model("course", CourseSchema);
module.exports = Course;
