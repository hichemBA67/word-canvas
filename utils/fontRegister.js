const { registerFont } = require("canvas");
const { SUB_FONTS, BASE_FONTFAMILY } = require("../constants");

SUB_FONTS.forEach((fontStyle) => {
  registerFont(`./assets/fonts/robot_slab/RobotoSlab-${fontStyle}.ttf`, {
    family: `${BASE_FONTFAMILY} ${fontStyle}`,
  });
});

module.exports = {};
