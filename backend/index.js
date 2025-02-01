const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { mongoose } = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");

// Enable CORS with credentials
app.use(cors({
  origin: 'http://localhost:5173',  // Adjust to match your frontend origin
  credentials: true,               // Allow credentials (cookies)
}));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database not connected", err));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", require("./routes/customerRoutes"));
app.use("/api", require("./routes/ownerRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));


const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
    