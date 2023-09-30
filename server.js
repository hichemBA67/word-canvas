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

app.get("/words", (req, res) => {
  res.json(storedWords);
});

app.post("/add-word", (req, res) => {
  const word = req.body.word;
  if (word) {
    storedWords.push(word);
    res.json({ success: true, word });
  } else {
    res.json({ success: false, message: "Invalid word" });
  }
});

app.use("/api/words", require("./routes/words"));
app.use("/api/canvas", require("./routes/canvas"));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
