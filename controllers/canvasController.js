const { createCanvas } = require("canvas");
const { saveImage } = require("../utils/imageUtils");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// UTILS
const {
  splitAndTrim,
  getRandomInt,
  getFontSize,
  getFontSizeForWidth,
  logWriting,
} = require("../utils/canvasUtils");

// CONSTANTS
const settingsService = require("../services/settingsService");
const {
  BASE_FONTFAMILY,
  SUB_FONTS,
  OUTPUT_PATH,
} = require("../constants/index");

// MODELS
const Canvas = require("../models/Canvas");

const generateCanvas = async (req, res) => {
  const input = req.body;

  try {
    // Get settings
    const settings = await settingsService.getSettings(req.params.settingsId);

    // Create a canvas

    const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, settings.canvasWidth, settings.canvasHeight);

    // Prepare UserWords
    let userWords;
    if (input.words) {
      userWords = splitAndTrim(input.words);
    } else {
      return res.json({
        canvasId: "",
      });
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
    let fontFamily;

    // Set Data Structures
    const endpoint = {};
    endpoint.x = settings.canvasWidth - settings.padding;
    endpoint.y = settings.canvasHeight;

    let cursor = {};
    cursor.x = settings.padding;
    cursor.y = settings.padding + settings.minFontSize;
    let lineSpaceRest = cursor.x - settings.padding;
    let emptySlots = [];

    let shuffledPhrases;
    let shuffledFillers = fillers.sort(() => 0.5 - Math.random());

    let continueLoop = true; // A flag to control the loop

    // Iterate through phrases
    do {
      shuffledPhrases = allPhrases.sort(() => 0.5 - Math.random());

      shuffledPhrases.forEach(({ text, type }) => {
        let i = 0;
        // Generate a random index within the array length
        const randomIndex = Math.floor(Math.random() * SUB_FONTS.length);

        let fontSize = getFontSize(
          type,
          settings.maxFontSize,
          settings.minFontSize
        );
        fontFamily = BASE_FONTFAMILY + " " + SUB_FONTS[randomIndex];
        ctx.font = `${fontSize}px ${fontFamily}`;

        const separatedWords = text.split(" ");

        const grayColor = getRandomInt(150, 20);
        ctx.fillStyle = `rgb(${grayColor},${grayColor},${grayColor})`;

        // Iterate through words of phrase
        separatedWords.forEach((word) => {
          if (!continueLoop) return;
          // Copy font size for line settings.canvasHeight
          const defaultFontSize = fontSize;

          lineSpaceRest = settings.canvasWidth - settings.padding - cursor.x;

          const textWidth = ctx.measureText(word).width;

          if (cursor.x + textWidth + settings.padding > textWidth) {
            // IF WORD IS OUT OF BOUNDS
            if (i === 0) {
              let fontSizeFit = getFontSizeForWidth(
                ctx,
                word,
                lineSpaceRest,
                fontSize,
                fontFamily
              );

              if (fontSizeFit > 18) {
                // Overwrite fontsize
                fontSize = fontSizeFit;

                // Set new font
                ctx.font = `${fontSize}px ${fontFamily}`;

                // WRITE WORD
                ctx.fillText(word, cursor.x, cursor.y);

                logWriting(word, cursor, fontSize);

                // LOG CURSOR

                cursor.x += ctx.measureText(word).width + settings.wordSpace;
              } else {
                if (lineSpaceRest > 0) {
                  // Add Empty slot
                  emptySlots.push({
                    x: cursor.x,
                    y: cursor.y,
                    space: lineSpaceRest,
                  });
                }

                // LOG CURSOR

                cursor.y += defaultFontSize + settings.lineSpace;
                cursor.x = settings.padding;

                if (cursor.y >= endpoint.y) {
                  continueLoop = false; // Set the flag to false to indicate the loop should exit
                  return; // This will exit the forEach callback, not the do...while loop
                }

                // WRITE WORD
                ctx.font = `${defaultFontSize}px ${fontFamily}`;
                ctx.fillText(word, cursor.x, cursor.y);
                logWriting(word, cursor, fontSize);

                cursor.x += ctx.measureText(word).width + settings.wordSpace;
              }
            } else {
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
              cursor.y += defaultFontSize + settings.lineSpace;

              if (cursor.y >= endpoint.y) {
                continueLoop = false; // Set the flag to false to indicate the loop should exit
                return; // This will exit the forEach callback, not the do...while loop
              }
              cursor.x = settings.padding;

              // WRITE WORD
              ctx.font = `${defaultFontSize}px ${fontFamily}`;
              ctx.fillText(word, cursor.x, cursor.y);
              logWriting(word, cursor, fontSize);

              cursor.x +=
                ctx.measureText(word).settings.canvasWidth + settings.wordSpace;
            }
          } else {
            ctx.fillText(word, cursor.x, cursor.y);
            logWriting(word, cursor, fontSize);

            cursor.x +=
              ctx.measureText(word).settings.canvasWidth + settings.wordSpace;
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

        if (
          fillerFontSize <= emptySlots[i].fontSize &&
          fillerFontSize >= settings.minFontSize &&
          Math.abs(
            ctx.measureText(shuffledFillers[j]).settings.canvasWidth -
              emptySlots[i].space
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

    canvasId = await saveImage(canvas, input.words);

    return res.json({
      canvasId: canvasId,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
};

const getCanvas = async (req, res) => {
  try {
    const canvas = await Canvas.findOne({ filename: req.params.canvasId });

    if (canvas.length === 0) {
      return res.status(404).send("Canvas not found");
    }

    const imagePath = path.join(OUTPUT_PATH, `${canvas.filename}.png`);

    // Set the correct content type
    res.setHeader("Content-Type", "image/png");

    // Create a read stream and pipe it to the response
    const readStream = fs.createReadStream(imagePath);
    readStream.pipe(res);
  } catch (error) {
    // If there's an error, return a 500 server error
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while fetching the canvas image");
  }
};

const getBackgroundCanvas = async (req, res) => {
  try {
    const canvas = await Canvas.findOne({
      filename: req.params.canvasId,
    }).populate("settings");

    if (!canvas) {
      return res.status(404).send("Canvas not found");
    }

    const foregroundImagePath = path.join(
      OUTPUT_PATH,
      `${canvas.filename}.png`
    );
    const backgroundImagePath = path.join(
      "./assets/background",
      "background.png"
    );

    const foregroundSize = {
      width: 590, // Desired settings.canvasWidth for the foreground image
      height: 810, // Desired settings.canvasHeight for the foreground image
    };

    // Ensure both images exist
    if (
      !fs.existsSync(foregroundImagePath) ||
      !fs.existsSync(backgroundImagePath)
    ) {
      return res.status(404).send("One or both images not found");
    }

    // Use sharp to resize the foreground image if necessary and composite it over the background
    res.type("image/png");

    sharp(foregroundImagePath)
      .resize(foregroundSize.width, foregroundSize.height) // Set the desired size
      .toBuffer()
      .then((resizedForegroundBuffer) => {
        sharp(backgroundImagePath)
          .composite([
            {
              input: resizedForegroundBuffer,
              left: 1320, // Position on the background image
              top: 450, // Position on the background image
              blend: "over",
            },
          ])
          .png()
          .pipe(res)
          .on("error", (err) => {
            console.error("An error occurred during image compositing:", err);
            res.status(500).send("An error occurred during image compositing");
          });
      })
      .catch((err) => {
        console.error("An error occurred during image resizing:", err);
        res.status(500).send("An error occurred during image resizing");
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the canvas");
  }
};

const deleteCanvas = async (req, res) => {
  try {
    const canvas = await Canvas.findOne({ filename: req.params.canvasId });
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Calculate time for one day ago

    if (!canvas) {
      return res.status(404).send("Canvas not found");
    } else if (!canvas.accepted || canvas.completed) {
      return res
        .status(400)
        .send(
          `Canvas cannot be deleted. Canvas is either accepted and not completed.`
        );
    } else if (canvas.createdAt > oneDayAgo) {
      return res.status(400).send(`Canvas is not older than one day`);
    }

    const imagePath = path.join(OUTPUT_PATH, `${canvas.filename}.png`);

    // Check if the file exists before attempting to delete
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the image file
      await Canvas.deleteOne({ filename: req.params.canvasId }); // Delete the canvas record from database, if required

      return res.send("Canvas deleted successfully");
    } else {
      return res.status(404).send("Image file not found");
    }
  } catch (error) {
    // If there's an error, return a 500 server error
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while deleting the canvas image");
  }
};

const clearCanvases = async (req, res) => {
  try {
    const canvases = await Canvas.find();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000 * 3); // Calculate time for one day ago

    // Using a for...of loop to allow awaiting inside
    for (const canvas of canvases) {
      if (canvas.createdAt > oneDayAgo) {
        try {
          const imagePath = path.join(OUTPUT_PATH, `${canvas.filename}.png`);

          // Check if the file exists before attempting to delete
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the image file

            // Assuming you want to delete by canvas._id instead of req.params.canvasId since you are iterating through multiple canvases
            await Canvas.findOneAndRemove({ _id: canvas._id });
            console.log(`Deleted canvas with ID: ${canvas._id}`);
          }
        } catch (error) {
          // If there's an error, console log it but don't send a response yet
          console.error(error);
        }
      }
    }
    // Send a response after all the operations are complete
    return res.status(200).send("Unused canvases successfully cleared.");
  } catch (error) {
    // If there's an error while fetching the canvases, return a 500 server error
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while deleting the canvases.");
  }
};

const acceptCanvas = async (req, res) => {
  try {
    const canvasId = req.params.canvasId;
    let canvas = await Canvas.findOne({ filename: canvasId });

    if (!canvas) {
      return res.status(404).send("Canvas not found");
    }

    canvas = await Canvas.findOneAndUpdate(
      { filename: canvasId },
      {
        $set: { accepted: true },
      },
      { new: true }
    );

    await canvas.save();

    return res.status(200).send("Canvas successfully accepted.");
  } catch (error) {
    // If there's an error while fetching the canvases, return a 500 server error
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while accepting the canvases.");
  }
};

const completeCanvas = async (req, res) => {
  try {
    const canvasId = req.params.canvasId;
    let canvas = await Canvas.findOne({ filename: canvasId });

    if (!canvas) {
      return res.status(404).send("Canvas not found");
    }

    if (!canvas.accepted) {
      return res.status(400).send("Canvas was not previously accepted.");
    }

    canvas = await Canvas.findOneAndUpdate(
      { filename: canvasId },
      {
        $set: { completed: true },
      },
      { new: true }
    );

    await canvas.save();

    return res.status(200).send("Canvas successfully marked as completed.");
  } catch (error) {
    // If there's an error while fetching the canvases, return a 500 server error
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while marking the canvas as completed.");
  }
};

module.exports = {
  generateCanvas,
  getCanvas,
  deleteCanvas,
  clearCanvases,
  acceptCanvas,
  completeCanvas,
  getBackgroundCanvas,
};
