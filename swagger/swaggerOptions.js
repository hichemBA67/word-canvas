const swaggerOptions = {
  swaggerDefinition: require("./swaggerDef"),
  apis: ["./routes/canvasRoutes.js", "./routes/settingsRoutes.js"], // Specify the path to your route files
};

module.exports = swaggerOptions;
