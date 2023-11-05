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
 *         description: Canvases deleted successfully
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
 *     description: Clears all canvases
 *     tags:
 *       - Canvas
 *     responses:
 *       '200':
 *         description: Unused canvases deleted successfully
 *       '500':
 *         description: Server error
 */
router.delete("/", canvasController.clearCanvases);

/**
 * @swagger
 * /api/canvas/accept:
 *   put:
 *     summary: Accept canvases
 *     description: Mark the canvas as accepted. This should be done when customer orders the canvas.
 *     tags:
 *       - Canvas
 *     responses:
 *       '200':
 *         description: Canvas successfully accepted
 *       '404':
 *         description: Canvas not found
 *       '500':
 *         description: Server error
 */
router.put("/accept/:canvasId", canvasController.acceptCanvas);

/**
 * @swagger
 * /api/canvas/complete:
 *   put:
 *     summary: Mark canvas as complete
 *     description: Marks canvas as completed
 *     tags:
 *       - Canvas
 *     responses:
 *       '200':
 *         description: Canvas successfully marked as completed
 *       '400':
 *         description: Canvas was not previously accepted
 *       '404':
 *         description: Canvas not found
 *       '500':
 *         description: Server error
 */
router.put("/complete/:canvasId", canvasController.completeCanvas);

module.exports = router;
