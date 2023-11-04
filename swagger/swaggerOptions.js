const swaggerOptions = {
  swaggerDefinition: require("./swaggerDef"),
  apis: ["./routes/canvas.js"], // Specify the path to your route files
};

module.exports = swaggerOptions;
