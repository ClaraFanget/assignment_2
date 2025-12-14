const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bookstore API",
      version: "1.0.0",
      description: "API Bookstore Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          // Arbitrary name for the scheme
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional, for documentation clarity
        },
      },
    },
  },
  apis: [__dirname + "/../src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerSpec, swaggerUi };
