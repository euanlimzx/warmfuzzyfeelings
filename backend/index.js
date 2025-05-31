const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend server!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
