const Course = require("../models/course.model");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { code, name, category, duration } = req.body;
    if (!code || !name || !category) {
      return res.status(400).json({
        success: false,
        message: "Necessary fields are required",
      });
    }

    if (
      typeof code !== "string" ||
      typeof name !== "string" ||
      typeof category !== "string" ||
      (duration && isNaN(parseInt(duration)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data types provided",
      });
    }

    const course = await Course.create({
      code,
      name,
      category,
      duration,
    });

    return res.status(201).json({
      success: true,
      data: course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    return res.status(200).json({
      success: true,
      data: courses,
      message: "Courses found",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found with provided id",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course found",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }

    const { name, category, duration } = req.body;
    if (!(name || category || duration)) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
    }

    if (
      typeof name !== "string" ||
      typeof category !== "string" ||
      (duration && isNaN(parseInt(duration)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data types provided",
      });
    }

    const course = await Course.findById(id);

    course.name = name || course.name;
    course.category = category || course.category;
    course.duration = duration || course.duration;

    await course.save();

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }

    const course = await Course.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

module.exports = router;
