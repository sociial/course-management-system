import { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useMemo } from "react";
import toast from "react-hot-toast";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    courseId: "",
    courseCode: "",
  });
  const [sortValue, setSortValue] = useState("code");

  const getCourses = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/courses");
      if (data?.success) {
        setCourses(data.data);
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.log(error.response.data);
        toast.error(error.response.data?.message || "Something went wrong");
      }
    }
  };

  const deleteCourse = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/api/courses/${modal.courseId}`
      );
      if (data?.success) {
        setCourses((prev) =>
          prev.filter((course) => course._id !== modal.courseId)
        );
        setModal({
          open: false,
          courseId: "",
          courseCode: "",
        });
        toast.success(data.message);
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.log(error.response.data);
        toast.error(error.response.data?.message || "Something went wrong");
      }
    }
  };

  const filteredCourses = useMemo(() => {
    let sortedCourses;
    if (sortValue === "duration") {
      sortedCourses = courses.sort((a, b) => a.duration - b.duration);
    } else {
      sortedCourses = courses.sort((a, b) =>
        a[sortValue].localeCompare(b[sortValue])
      );
    }
    if (search === "") return courses;
    return courses.filter((course) =>
      course.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search, sortValue]);

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="container py-5 gap-5">
      <h1 className="text-center h1 mb-5" style={{ letterSpacing: "-0.05em" }}>
        Courses
      </h1>
      <div className="row justify-content-between pb-3">
        <div className="col-4 d-flex align-items-center justify-content-between gap-2 p-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            placeholder="Search by category"
          />
          <button className="btn btn-primary">Search</button>
        </div>
        <div className="col-4 d-flex align-items-center justify-content-center gap-2">
          <label htmlFor="sort" className="form-label align-middle text-nowrap">
            Sort By
          </label>
          <select
            name="sort"
            id="sort"
            className="form-select"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
          >
            <option value="code">Code</option>
            <option value="name">Title</option>
            <option value="category">Category</option>
            <option value="duration">Duration</option>
          </select>
          <button
            className="btn btn-success text-nowrap"
            onClick={() => navigate("/add")}
          >
            Add Course
          </button>
        </div>
      </div>
      <table className="table table-bordered table-striped table-hover table-dark text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Title</th>
            <th>Category</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <tr key={index}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">{course.code}</td>
                <td className="align-middle">{course.name}</td>
                <td className="align-middle">{course.category}</td>
                <td className="align-middle">{course.duration} hrs</td>
                <td className="d-flex gap-1 align-items-center justify-content-center">
                  <button
                    onClick={() => navigate(`/update/${course._id}`)}
                    className="btn btn-small btn-outline-primary"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    data-bs-title="Tooltip on right"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-small btn-outline-danger"
                    onClick={() =>
                      setModal({
                        open: true,
                        courseId: course._id,
                        courseCode: course.code,
                      })
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={6}>
                No Courses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modal.open && (
        <div
          className={`modal fade modal-dialog-centered ${
            modal.open ? "show" : ""
          }`}
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Delete Course
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() =>
                    setModal({
                      open: false,
                      courseId: "",
                      courseCode: "",
                    })
                  }
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete course with code -
                {modal.courseCode}?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() =>
                    setModal({
                      open: false,
                      courseId: "",
                      courseCode: "",
                    })
                  }
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteCourse}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
