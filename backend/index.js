const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Enable CORS with credentials
app.use(cors({
  origin: "http://localhost:5173",  // Adjust to match your frontend origin
  credentials: true,                // Allow credentials (cookies)
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database not connected:", err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Serve static file uploads

app.use("/Shop-uploads", express.static(path.join(__dirname, "Shop-uploads")));  // Added shop images storage

// Routes
app.use("/api", require("./routes/customerRoutes"));
app.use("/api", require("./routes/ownerRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/chef", require("./routes/chefRoutes"));
app.use("/api/customer", require("./routes/reviewRoutes")); 
app.use("/api/shop", require("./routes/shopRoutes"));  // Added shop routes
app.use("/api/shop/cart", require("./routes/cartShopRoutes"));  // Added shop routes


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
