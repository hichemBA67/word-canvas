const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const wordInput = document.getElementById("wordInput");
const addWordButton = document.getElementById("addWord");
const downloadButton = document.getElementById("downloadButton");

let words = [];

function setup() {
  createCanvas(800, 600);
  const addWordButton = select("#addWord");
  addWordButton.mousePressed(addWord);

  const downloadButton = select("#downloadButton");
  downloadButton.mousePressed(downloadImage);
}

function draw() {
  background(255);
  let x = 10;
  let y = 30;
  fill(0);
  textSize(30);
  words.forEach((word) => {
    text(word, x, y);
    x += textWidth(word) + 20;
    if (x > width - 100) {
      x = 10;
      y += 40;
    }
  });
}

function addWord() {
  const wordInput = select("#wordInput");
  const word = wordInput.value();
  if (word) {
    words.push(word);
    wordInput.value("");
  }
}

function downloadImage() {
  saveCanvas("visualization", "png");
}
