const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

//Connect DB
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const storedWords = [];

app.get("/", (req, res) => {
  res.json("Welcome to the Word-Canvas Backend");
});

app.use("/api/words", require("./routes/words"));
app.use("/api/canvas", require("./routes/canvas"));
app.use("/api/filler", require("./routes/filler"));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
