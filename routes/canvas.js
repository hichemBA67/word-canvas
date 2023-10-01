const express = require("express");
const router = express.Router();
const { createCanvas, registerFont } = require("canvas");
registerFont("./assets/fonts/arial_light.ttf", { family: "Arial Light" });

router.get("/", async (req, res) => {
  const inputWords = req.body;
  const userWords = ["Test"];
  try {
    const storedWordsReq = await Words.find().select("word");

    let storedWords = [];
    for (let i = 0; i < storedWordsReq.length; i++) {
      storedWords.push(storedWordsReq[i].word);
    }

    // Create a canvas
    const width = 540,
      height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    const allPhrases = [];

    // Construct allPhrases Array
    userWords.forEach((word) => {
      allPhrases.push({ text: word.toUpperCase(), type: "user" });
    });
    storedWords.forEach((phrase) => {
      allPhrases.push({ text: phrase.toUpperCase(), type: "stored" });
    });

    const shuffledPhrases = allPhrases.sort(() => 0.5 - Math.random());

    let x = 30,
      y = 50;

    const padding = 30;

    let lineWidth = 0;
    let wordsInLine = [];

    // Iterate through phrases
    shuffledPhrases.forEach(({ text, type }) => {
      const fontSize = 30;
      ctx.font = `${fontSize}px Arial Light`;

      const grayColor = 0;
      ctx.fillStyle = `rgb(${grayColor},${grayColor},${grayColor})`;

      const separatedWords = text.split(" ");

      separatedWords.forEach((word) => {
        console.log(word);
      });
      const textWidth = ctx.measureText(text).width;

      if (lineWidth + textWidth + padding > width) {
        x = 20;
        wordsInLine.forEach((word) => {
          ctx.fillText(word.text, x, y);
          x += ctx.measureText(word.text).width + 10;
        });
        lineWidth = 0;
        wordsInLine = []; // Clear the array
        y += fontSize + 5;
      }
      lineWidth += textWidth + 5;
      wordsInLine.push({ text });
    });
    if (wordsInLine.length) {
      x = 20;
      wordsInLine.forEach((word) => {
        ctx.fillText(word.text, x, y);
        x += ctx.measureText(word.text).width + 5;
      });
    }

    // Set the content type to image/png and send the response
    res.type("image/png");
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
