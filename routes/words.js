const express = require("express");
const Words = require("../models/Words");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  const words = await Words.find();

  if (Words.length === 0) {
    res.json("No Words found!");
  }

  res.json(words);
});

router.post(
  "/add-word/",
  [check("word", "Word is required").not().isEmpty()],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { word, priority } = req.body;

    try {
      let newWord = new Words({
        word,
        priority,
      });

      await newWord.save();
      res.json(word);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
