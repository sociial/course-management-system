import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

function Form() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    code: "",
    name: "",
    category: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);

  const getCourse = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/courses/${id}`
      );
      if (data?.success) {
        setCourse(data.data);
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.log(error.response.data);
        toast.error(error.response.data?.message || "Something went wrong");
      }
    }
  };

  const updateCourse = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `http://localhost:3000/api/courses/${id}`,
        course
      );
      if (data?.success) {
        navigate("/");
        toast.success(data.message);
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.log(error.response.data);
        toast.error(error.response.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `http://localhost:3000/api/courses`,
        course
      );
      if (data?.success) {
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.log(error.response.data);
        toast.error(error.response.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathname.includes("/update/") && id) {
      getCourse();
    }
  }, [pathname]);

  return (
    <div className="container py-5">
      <h1 className="h1 text-center mb-5" style={{ letterSpacing: "-0.05em" }}>
        {pathname?.includes("/add") ? "Add Course" : "Update Course"}
      </h1>
      <div className="row">
        <div className="bg-light text-dark shadow-sm p-4 mx-auto rounded-3 d-flex flex-column gap-3 col-lg-6 col-md-8 col-sm-10 col-11">
          {pathname?.includes("/add") && (
            <div className="form-group">
              <label htmlFor="code" className="form-label">
                Code
              </label>
              <input
                type="text"
                id="code"
                value={course.code}
                onChange={(e) =>
                  setCourse((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="Enter course code"
                className="form-control"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="name"
              value={course.name}
              onChange={(e) =>
                setCourse((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter course title"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={course.category}
              onChange={(e) =>
                setCourse((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="Enter course category"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration" className="form-label">
              Duration
            </label>
            <input
              type="number"
              value={course.duration}
              onChange={(e) =>
                setCourse((prev) => ({ ...prev, duration: e.target.value }))
              }
              id="duration"
              placeholder="Enter course duration"
              className="form-control"
            />
          </div>
          <div className="d-flex flex-column gap-2">
            <button
              onClick={pathname?.includes("/add") ? addCourse : updateCourse}
              className="btn btn-success w-100"
              disabled={
                !course.name ||
                !course.category ||
                !course.name ||
                (pathname?.includes("/add") && !course.code)
              }
            >
              {loading ? (
                <span
                  class="spinner-border spinner-border-sm"
                  aria-hidden="true"
                ></span>
              ) : pathname?.includes("/add") ? (
                "Save"
              ) : (
                "Update"
              )}
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary w-100"
            >
              View Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
