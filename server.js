const express = require("express");
const cors = require("cors")
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./connect/database");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users",require("./routes/userRoutes"))

app.use(errorHandler);

app.listen(port, () => console.log("listening to port " + port));
