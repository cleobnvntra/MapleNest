const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stoppable = require("stoppable");
const dotenv = require("dotenv");
const { setupDatabase } = require("./src/database");
const { addDefaultInterestPoints } = require("./src/database/cosmos");

const app = express();

const corsOptions = {
  origin: ["https://frontend-opal-pi-32.vercel.app", "http://localhost:3000"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`,
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ""}`;
}

app.use(require("./src/Routes"));

const port = 8080;

const server = stoppable(
  app.listen(port, async () => {
    console.log(`App listening at http://localhost:${port}`);
  }),
);

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  try {
    server.stop(() => {
      console.log("Server stopped.");
      process.exit(0); // Ensure the process exits cleanly
    });
  } catch (error) {
    console.error("Error saving database:", error);
    process.exit(1); // Exit with an error code if saving fails
  }
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  try {
    server.stop(() => {
      console.log("Server stopped.");
      process.exit(0); // Ensure the process exits cleanly
    });
  } catch (error) {
    console.error("Error saving database:", error);
    process.exit(1); // Exit with an error code if saving fails
  }
});
