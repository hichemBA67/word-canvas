const express = require("express");
const Filler = require("../models/Filler");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  const filler = await Filler.find();

  if (Filler.length === 0) {
    res.json("No Filler found!");
  }

  res.json(filler);
});

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

router.delete("/:fillerId", async (req, res) => {
  try {
    await Filler.findOneAndRemove({ _id: req.params.fillerId });
    res.json("Filler deleted successfully!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

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
