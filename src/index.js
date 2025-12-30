const express = require("express");
const cors = require("cors");
const connectDB = require("./db/index");
const courseRoutes = require("./routes/course.route");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/courses", courseRoutes);

connectDB()
  .then(() =>
    app.listen(port, () =>
      console.log(`App is running on http://localhost:${port}`)
    )
  )
  .catch(() => console.log("Connection Error"));
