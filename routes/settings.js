/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: Operations related to settings
 */

const express = require("express");
const Settings = require("../models/Settings");
const router = express.Router();
const { check, validationResult } = require("express-validator");

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get all settings
 *     description: Get all settings from database
 *     tags:
 *       - Settings
 *     responses:
 *       '200':
 *         description: Get all settings
 *       '500':
 *         description: Server error
 */
router.get("/", async (req, res) => {
  const orders = await Orders.find();

  if (orders.length === 0) {
    res.json("No orders found!");
  }

  res.json(orders);
});

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Submit settings
 *     description: Upon submitting the order the customer data will be saved with the desired canvas
 *     tags:
 *       - Settings
 *     responses:
 *       '200':
 *         description: Settings is successfully submitted
 *       '500':
 *         description: Server error
 */
router.post(
  "/:canvasId",
  [
    check("firstName", "firstName is required").not().isEmpty(),
    check("lastName", "lastName is required").not().isEmpty(),
    check("address", "Word is required").not().isEmpty(),
  ],
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
 * /api/settings:
 *   put:
 *     summary: Update settings
 *     description:
 *     tags:
 *       - Settings
 *     responses:
 *       '200':
 *         description: Settings is successfully submitted
 *       '500':
 *         description: Server error
 */

module.exports = router;
