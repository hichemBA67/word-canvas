/**
 * @swagger
 * tags:
 *   - name: Canvas
 *     description: Operations related to canvas
 */

const express = require("express");
const router = express.Router();
const canvasController = require("../controllers/canvasController");

/**
 * @swagger
 * /api/canvas:
 *   post:
 *     summary: Generate canvas
 *     description: Generates the canvas with words from user input
 *     tags:
 *       - Canvas
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               words:
 *                 type: string
 *                 description: A string of words separated by commas
 *                 example: "Overcome, Progress, Achieve, Conquer"
 *     responses:
 *       '200':
 *         description: Creates Canvas (res.type("image/png"))
 *       '500':
 *         description: Server error
 */

router.post("/", canvasController.generateCanvas);

/**
 * @swagger
 * /api/canvas:
 *   get:
 *     summary: Get canvas
 *     description: Get canvas from canvas ID
 *     tags:
 *       - Canvas
 *     parameters:
 *       - in: query
 *         name: canvasId
 *         description: Internal Canvas ID (SHA256 of user input & date of generation)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Creates Canvas (res.type("image/png"))
 *       '404':
 *         description: Canvas not found
 *       '500':
 *         description: Server error
 */
router.get("/:canvasId", canvasController.getCanvas);

module.exports = router;
