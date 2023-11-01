/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Operations related to orders
 */

const express = require("express");
const Orders = require("../models/Orders");
const router = express.Router();
const { check, validationResult } = require("express-validator");

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get all orders
 *     description: Get all orders from database
 *     tags:
 *       - Orders
 *     responses:
 *       '200':
 *         description: Get all orders
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
 * /api/order:
 *   post:
 *     summary: Submit order
 *     description: Upon submitting the order the customer data will be saved with the desired canvas
 *     tags:
 *       - Orders
 *     responses:
 *       '200':
 *         description: Order is successfully submitted
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

module.exports = router;
