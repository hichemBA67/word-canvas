/**
 * @swagger
 * tags:
 *   - name: Words
 *     description: Operations related to words
 */

const express = require("express");
const Words = require("../models/Words");
const router = express.Router();
const { check, validationResult } = require("express-validator");

/**
 * @swagger
 * /api/words:
 *   get:
 *     summary: Get filler
 *     description: Get all words from database
 *     tags:
 *       - Words
 *     responses:
 *       '200':
 *         description: Get all words
 *       '500':
 *         description: Server error
 */
router.get("/", async (req, res) => {
  const words = await Words.find();

  if (words.length === 0) {
    res.json("No Words found!");
  }

  res.json(words);
});

/**
 * @swagger
 * /api/words:
 *   post:
 *     summary: Create filler
 *     description: Create the word in database
 *     tags:
 *       - Words
 *     responses:
 *       '200':
 *         description: Word created successfully
 *       '500':
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/words:
 *   delete:
 *     summary: Delete words
 *     description: Delete the words with the wordsId in the database
 *     tags:
 *       - Words
 *     parameters:
 *       - in: query
 *         name: wordId
 *         description: MongoDB _id of word
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Word deleted successfully
 *       '500':
 *         description: Server error
 */
router.delete("/:wordId", async (req, res) => {
  try {
    await Words.findOneAndRemove({ _id: req.params.wordId });
    res.json("Word deleted successfully!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * @swagger
 * /api/words:
 *   put:
 *     summary: Update word
 *     description: Update the filler with the wordId in the database
 *     tags:
 *       - Words
 *     parameters:
 *       - in: query
 *         name: wordId
 *         description: MongoDB _id of filler
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Word updated successfully
 *       '500':
 *         description: Server error
 */
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
