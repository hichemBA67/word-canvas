const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

// Swagger
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerOptions = require("./swagger/swaggerOptions"); // Import your Swagger options

//Connect DB
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json("Welcome to the Word-Canvas Backend");
});

app.use("/api/words", require("./routes/words"));
app.use("/api/canvas", require("./routes/canvasRoutes"));
app.use("/api/filler", require("./routes/filler"));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
