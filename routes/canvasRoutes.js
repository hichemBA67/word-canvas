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
 *     description: Get canvas with canvas ID
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

/**
 * @swagger
 * /api/canvas/:
 *   delete:
 *     summary: Delete canvas
 *     description: Delete canvas with canvas ID
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
 *       '400':
 *         description: Canvas not found or Canvas cannot be deleted. Canvas is either accepted and not completed.
 *       '404':
 *         description: Canvas is not older than one day
 *       '500':
 *         description: Server error
 */
router.delete("/:canvasId", canvasController.deleteCanvas);

/**
 * @swagger
 * /api/canvas:
 *   delete:
 *     summary: Clear canvases
 *     description: Delete canvas all unused canvases
 *     tags:
 *       - Canvas
 *     responses:
 *       '200':
 *         description: Creates Canvas (res.type("image/png"))
 *       '404':
 *         description: Canvas not found
 *       '500':
 *         description: Server error
 */
router.delete("/", canvasController.clearCanvases);

module.exports = router;
