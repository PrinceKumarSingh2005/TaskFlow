const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./modals/User");
const authMiddleware = require("./middleware/auth");
const taskRoutes = require("./routes/taskRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");


const app = express();

app.use(express.json());


// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/TaskFlow")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });


// General middleware
app.use((req, res, next) => {
    console.log("middleware running");
    next();
});


// Test middleware
app.use("/test", (req, res, next) => {
    console.log(req.method);
    console.log(req.url);
    next();
});


// Test routes
app.post("/", (req, res) => {
    console.log(req.body);
    res.send("Data received");
});

app.get("/generate-token", (req, res) => {
    const token = jwt.sign(
        {
            userId: 101,
            role: "user"
        },
        "mysecretkey"
    );

    console.log(token);
    res.send(token);
});

app.post("/test", (req, res) => {
    console.log(req.body);
    res.send("Data received");
});


// Protected profile route
app.use("/profile", authMiddleware);

app.get("/profile", (req, res) => {
    console.log(req.user);

    res.send(`Welcome User ${req.user.userId}`);
});


// Register
app.post("/register", async (req, res) => {

    const { Username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        Username: Username,
        email: email,
        password: hashedPassword,
        role: role
    });

    res.status(201).send("User registered successfully");
});


// Login
app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    console.log("Email received:", email);
    console.log("Password received:", password);

    const user = await User.findOne({ email });

    console.log("User found:", user);

    if (!user) {
        return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
        return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        "mysecretkey"
    );

    res.send({
        message: "Login successful",
        token: token
    });
});

 app.use("/tasks", taskRoutes);

 app.use(errorMiddleware);

app.listen(3009, () => {
    console.log("TaskFlow server is running on port 3009");
});