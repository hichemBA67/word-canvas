/**
 * @swagger
 * tags:
 *   - name: Fillers
 *     description: Operations related to fillers
 */

const express = require("express");
const Filler = require("../models/Filler");
const router = express.Router();
const { check, validationResult } = require("express-validator");

/**
 * @swagger
 * /api/filler:
 *   get:
 *     summary: Get filler
 *     description: Get all fillers from database
 *     tags:
 *       - Fillers
 *     responses:
 *       '200':
 *         description: Get all fillers
 *       '500':
 *         description: Server error
 */
router.get("/", async (req, res) => {
  const filler = await Filler.find();

  if (Filler.length === 0) {
    res.json("No Filler found!");
  }

  res.json(filler);
});

/**
 * @swagger
 * /api/filler:
 *   post:
 *     summary: Create filler
 *     description: Create the filler in database
 *     tags:
 *       - Fillers
 *     responses:
 *       '200':
 *         description: Filler created successfully
 *       '500':
 *         description: Server error
 */
router.post(
  "/",
  [check("filler", "Filler is required").not().isEmpty()],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { filler } = req.body;

    try {
      let newFiller = new Filler({
        filler,
      });

      await newFiller.save();
      res.json(newFiller);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @swagger
 * /api/filler:
 *   delete:
 *     summary: Delete filler
 *     description: Delete the filler with the fillerId in the database
 *     tags:
 *       - Fillers
 *     parameters:
 *       - in: query
 *         name: fillerId
 *         description: MongoDB _id of filler
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Filler deleted successfully
 *       '500':
 *         description: Server error
 */
router.delete("/:fillerId", async (req, res) => {
  try {
    await Filler.findOneAndRemove({ _id: req.params.fillerId });
    res.json("Filler deleted successfully!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * @swagger
 * /api/filler:
 *   put:
 *     summary: Update filler
 *     description: Update the filler with the fillerId in the database
 *     tags:
 *       - Fillers
 *     parameters:
 *       - in: query
 *         name: fillerId
 *         description: MongoDB _id of filler
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Filler updated successfully
 *       '500':
 *         description: Server error
 */
router.put("/:fillerId", async (req, res) => {
  const { filler } = req.body;

  try {
    let fillerReq = await Filler.findById(req.params.fillerId);
    if (!fillerReq) {
      return res.json("Filler not found!");
    }

    fillerReq = await Filler.findOneAndUpdate(
      { _id: req.params.fillerId },
      {
        $set: { filler },
      },
      { new: true }
    );

    await fillerReq.save();
    res.json(fillerReq);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
