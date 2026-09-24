const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const listingRoutes = require("./routes/listingRoutes");

const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Campus Marketplace API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});