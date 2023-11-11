function getFontSize(type, MAX_FONTSIZE, MIN_FONTSIZE) {
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  getRandomInt,
  getFontSize,
  getFontSizeForWidth,
  logWriting,
  splitAndTrim, // If you have this function implemented elsewhere, include it here.
};
