const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// Import the service routers
const userRoutes = require("./servers/userServer");
const questionRoutes = require("./servers/questionServer");
const quizCategoryRoutes = require("./servers/quizCategoryServer");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 6004;

// Mount them under different base paths
app.use("/api/users", userRoutes); // Access via http://localhost:6004/users
app.use("/api/questions", questionRoutes); // Access via http://localhost:6004/questions
app.use("/api/quiz-categories", quizCategoryRoutes); // Access via http://localhost:6004/quizCategories

const mongodbURL =
  "mongodb+srv://prasadpathala:99HAoXFb5tVZgrpI@mycluster1.4gohiwv.mongodb.net/?appName=MyCluster1";

// 1. Connect to MongoDB (Once for the entire app)
mongoose
  .connect(mongodbURL, { dbName: "quiz-app-db" })
  .then(() =>
    console.log(`Connected to MongoDB from server.js (port: ${PORT})`),
  )
  .catch((error) =>
    console.error(
      `MongoDB Connection error from server.js (port: ${PORT})`,
      error,
    ),
  );

app.listen(PORT, () => {
  console.log(`Unified server running at http://localhost:${PORT}`);
});
