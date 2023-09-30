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
  "/",
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

router.delete("/:wordId", async (req, res) => {
  try {
    await Words.findOneAndRemove({ _id: req.params.wordId });
    res.json("Word deleted successfully!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.put("/:wordId", async (req, res) => {
  const { word, priority } = req.body;

  try {
    let wordReq = await Words.findById(req.params.wordId);
    if (!wordReq) {
      return res.json("Word not found!");
    }

    wordReq = await Words.findOneAndUpdate(
      { _id: req.params.wordId },
      {
        $set: { word, priority },
      },
      { new: true }
    );

    await wordReq.save();
    res.json(wordReq);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
