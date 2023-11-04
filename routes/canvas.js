/**
 * @swagger
 * tags:
 *   - name: Canvas
 *     description: Operations related to canvas
 */

const express = require("express");
const router = express.Router();
const { createCanvas, registerFont } = require("canvas");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const Canvas = require("../models/Canvas");

// CONSTANTS
const OUTPUT_PATH = "./assets/images";
const MIN_FONTSIZE = 24;
const MAX_FONTSIZE = 38;
const BASE_FONTFAMILY = "RobotoSlab";
const SUB_FONTS = [
  "Regular",
  "Black",
  "Bold",
  "ExtraBold",
  "ExtraLight",
  "Light",
  "Medium",
];

registerFont("./assets/fonts/robot_slab/RobotoSlab-Regular.ttf", {
  family: "RobotoSlab Regular",
});
registerFont("./assets/fonts/robot_slab/RobotoSlab-Black.ttf", {
  family: "RobotoSlab Black",
});
registerFont("./assets/fonts/robot_slab/RobotoSlab-Bold.ttf", {
  family: "RobotoSlab Bold",
});
registerFont("./assets/fonts/robot_slab/RobotoSlab-ExtraBold.ttf", {
  family: "RobotoSlab Extra Bold",
});
registerFont("./assets/fonts/robot_slab/RobotoSlab-ExtraLight.ttf", {
  family: "RobotoSlab Extra Light",
});
registerFont("./assets/fonts/robot_slab/RobotoSlab-Light.ttf", {
  family: "RobotoSlab Extra Bold",
});
registerFont("./assets/fonts/robot_slab/RobotoSlab-Medium.ttf", {
  family: "RobotoSlab Medium",
});

/**
 * @swagger
 * /api/canvas:
 *   post:
 *     summary: Get canvas
 *     description: Creates the canvas with words from user input
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

router.post("/", async (req, res) => {
  const input = req.body;

  try {
    // Create a canvas
    const width = 540;
    height = 800;
    const padding = 30;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // Prepare UserWords
    let userWords;
    if (input.words) {
      userWords = splitAndTrim(input.words);
    } else {
      res.type("image/png");
      return canvas.createPNGStream().pipe(res);
    }

    // // Stored Words
    // const storedWordsReq = await Words.find().select("word");
    // let storedWords = [];
    // for (let i = 0; i < storedWordsReq.length; i++) {
    //   storedWords.push(storedWordsReq[i].word);
    // }

    // Filler
    const fillerReq = await Filler.find();
    let fillers = [];
    for (let i = 0; i < fillerReq.length; i++) {
      fillers.push(fillerReq[i].filler.toUpperCase());
    }

    const allPhrases = [];

    // Construct allPhrases Array
    userWords.forEach((word) => {
      allPhrases.push({ text: word.toUpperCase(), type: "user" });
    });
    // storedWords.forEach((phrase) => {
    //   allPhrases.push({ text: phrase.toUpperCase(), type: "stored" });
    // });

    // Set options
    const lineSpace = (MAX_FONTSIZE - MIN_FONTSIZE) / 2;
    const wordSpace = 5;
    let fontFamily;

    // Set Data Structures
    const endpoint = {};
    endpoint.x = width - padding;
    endpoint.y = height - padding;

    let cursor = {};
    cursor.x = 30;
    cursor.y = 50;
    let lineSpaceRest = width - padding;
    let emptySlots = [];

    console.log(
      "==================================================================================================="
    );

    let shuffledPhrases;
    let shuffledFillers = fillers.sort(() => 0.5 - Math.random());

    let continueLoop = true; // A flag to control the loop

    // Iterate through phrases
    do {
      shuffledPhrases = allPhrases.sort(() => 0.5 - Math.random());

      shuffledPhrases.forEach(({ text, type }) => {
        console.log(
          `==============================================NEW PHRASE ${text}=============================`
        );

        let i = 0;
        // Generate a random index within the array length
        const randomIndex = Math.floor(Math.random() * SUB_FONTS.length);

        let fontSize = getFontSize(type);
        fontFamily = BASE_FONTFAMILY + " " + SUB_FONTS[randomIndex];
        ctx.font = `${fontSize}px ${fontFamily}`;

        const separatedWords = text.split(" ");

        const grayColor = getRandomInt(150, 20);
        ctx.fillStyle = `rgb(${grayColor},${grayColor},${grayColor})`;

        // Iterate through words of phrase
        separatedWords.forEach((word) => {
          // Copy font size for line height
          const defaultFontSize = fontSize;

          lineSpaceRest = width - padding - cursor.x;
          console.log("\nNext word: " + word);
          console.log(`Word in phrase count: ${i}`);

          const textWidth = ctx.measureText(word).width;
          console.log("Word width: " + textWidth);

          console.log("Current cursor position x: " + cursor.x);
          console.log("Current cursor position y: " + cursor.y);
          console.log("Rest space would be: " + lineSpaceRest);

          if (cursor.x + textWidth + padding > width) {
            // IF WORD IS OUT OF BOUNDS
            if (i === 0) {
              let fontSizeFit = getFontSizeForWidth(
                ctx,
                word,
                lineSpaceRest,
                fontSize,
                fontFamily
              );
              console.log("++ new potential font size: " + fontSizeFit);

              if (fontSizeFit > 18) {
                console.log("++ new font size accepted");

                // Overwrite fontsize
                fontSize = fontSizeFit;

                // Set new font
                ctx.font = `${fontSize}px ${fontFamily}`;

                // WRITE WORD
                ctx.fillText(word, cursor.x, cursor.y);

                logWriting(word, cursor, fontSize);

                // LOG CURSOR
                console.log(`-- Cursor x updated from: ${cursor.x}`);
                cursor.x += ctx.measureText(word).width + wordSpace;
                console.log(`to: ${cursor.x}`);
              } else {
                console.log("++ new font size declined");

                if (lineSpaceRest > 0) {
                  // Add Empty slot
                  emptySlots.push({
                    x: cursor.x,
                    y: cursor.y,
                    space: lineSpaceRest,
                  });
                }

                // LOG CURSOR
                console.log(`-- Cursor y updated from: ${cursor.y}`);
                cursor.y += defaultFontSize + lineSpace;
                console.log(`to: ${cursor.y}`);
                console.log(`-- Cursor x updated from: ${cursor.x}`);
                cursor.x = padding;
                console.log(`to: ${cursor.x}`);

                if (cursor.y >= endpoint.y) {
                  continueLoop = false; // Set the flag to false to indicate the loop should exit
                  return; // This will exit the forEach callback, not the do...while loop
                }

                // WRITE WORD
                ctx.font = `${defaultFontSize}px ${fontFamily}`;
                ctx.fillText(word, cursor.x, cursor.y);
                logWriting(word, cursor, fontSize);

                // LOG CURSOR
                console.log(`-- Cursor x updated from: ${cursor.x}`);
                cursor.x += ctx.measureText(word).width + wordSpace;
                console.log(`to: ${cursor.x}`);
              }
            } else {
              console.log("++ new font size declined");

              if (lineSpaceRest > 0) {
                // Add Empty slot
                emptySlots.push({
                  x: cursor.x,
                  y: cursor.y,
                  space: lineSpaceRest,
                  fontSize: defaultFontSize,
                });
              }

              // LOG CURSOR
              console.log(`-- Cursor y updated from: ${cursor.y}`);
              cursor.y += defaultFontSize + lineSpace;
              if (cursor.y >= endpoint.y) {
                // End while loop here
              }
              console.log(`to: ${cursor.y}`);
              console.log(`-- Cursor x updated from: ${cursor.x}`);
              cursor.x = padding;
              console.log(`to: ${cursor.x}`);

              // WRITE WORD
              ctx.font = `${defaultFontSize}px ${fontFamily}`;
              ctx.fillText(word, cursor.x, cursor.y);
              logWriting(word, cursor, fontSize);

              // LOG CURSOR
              console.log(`-- Cursor x updated from: ${cursor.x}`);
              cursor.x += ctx.measureText(word).width + wordSpace;
              console.log(`to: ${cursor.x}`);
            }
          } else {
            ctx.fillText(word, cursor.x, cursor.y);
            logWriting(word, cursor, fontSize);

            console.log(`-- Cursor x updated from: ${cursor.x}`);
            cursor.x += ctx.measureText(word).width + wordSpace;
            console.log(`to: ${cursor.x}`);
          }

          // INCREASE COUNTER OF WORDS IN PHRASE
          i++;
        });
      });
      if (!continueLoop) {
        break; // Exit the loop if the flag is set to false
      }
    } while (continueLoop && cursor.y <= endpoint.y);

    // FILL EMPTY SLOTS
    for (i = 0; i < emptySlots.length; i++) {
      for (j = 0; j < shuffledFillers.length; j++) {
        // Generate a random index within the array length
        const randomIndex = Math.floor(Math.random() * SUB_FONTS.length);
        fontFamily = BASE_FONTFAMILY + " " + SUB_FONTS[randomIndex];

        const fillerFontSize = getFontSizeForWidth(
          ctx,
          shuffledFillers[j],
          emptySlots[i].space,
          emptySlots[i].fontSize,
          fontFamily
        );
        console.log(
          shuffledFillers[j],
          ctx.measureText(shuffledFillers[j]).width,
          emptySlots[i].space
        );

        console.log(
          ctx.measureText(shuffledFillers[j]).width - emptySlots[i].space
        );

        if (
          fillerFontSize <= emptySlots[i].fontSize &&
          fillerFontSize >= MIN_FONTSIZE &&
          Math.abs(
            ctx.measureText(shuffledFillers[j]).width - emptySlots[i].space
          ) <= 20
        ) {
          ctx.font = `${fillerFontSize}px ${fontFamily}`;
          ctx.fillText(shuffledFillers[j], emptySlots[i].x, emptySlots[i].y);
          logWriting(
            shuffledFillers[j],
            { x: emptySlots[i].x, y: emptySlots[i].y },
            fillerFontSize
          );
          shuffledFillers = fillers.sort(() => 0.5 - Math.random());

          break;
        }
      }
    }

    if (true) {
      await saveImage(canvas, input.words);
    }

    // Set the content type to image/png and send the response
    res.type("image/png");
    return canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;

async function saveImage(canvas, userWords) {
  const stream = canvas.createPNGStream();
  const steamHash = crypto
    .createHash("sha256")
    .update(userWords + Date.now())
    .digest("hex");
  const outputPath = `${OUTPUT_PATH}/${steamHash}.png`;

  // Get directory without the filename
  const dirPath = path.dirname(outputPath);

  // Check if directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const out = fs.createWriteStream(outputPath);
  stream.pipe(out);
  out.on("finish", () => {
    console.log(`The PNG file was created at ${outputPath}`);
  });

  let newCanvas = new Canvas({
    filename: steamHash,
    userInput: userWords,
  });

  await newCanvas.save();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getFontSize(type) {
  if (type == "stored") {
    return (
      Math.floor(Math.random() * (MAX_FONTSIZE - MIN_FONTSIZE + 1)) +
      MIN_FONTSIZE
    );
  } else if (type == "user") {
    return (
      Math.floor(Math.random() * (MAX_FONTSIZE - MIN_FONTSIZE + 1)) +
      MIN_FONTSIZE
    );
  } else {
    return 20;
  }
}

function getFontSizeForWidth(
  ctx,
  text,
  desiredWidth,
  initialFontSize,
  fontFamily
) {
  let fontSize = initialFontSize;
  ctx.font = `${fontSize}px ${fontFamily}`;

  while (ctx.measureText(text).width > desiredWidth && fontSize > 0) {
    fontSize--;
    ctx.font = `${fontSize}px ${fontFamily}`;
  }

  return fontSize;
}

function logWriting(word, cursor, fontSize) {
  console.log(
    `${word} written at x:${cursor.x} - y:${cursor.y} in ${fontSize}px`
  );
}

function splitAndTrim(str) {
  // Split the string by commas and then map each element
  // to trim whitespace from the start and end of the string.
  return str.split(",").map((word) => word.trim());
}
