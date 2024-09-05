import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import db from "./src/models";
import routes from "./src/routes";
const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("App runnig and db connected");
  } catch (error) {
    console.log("Error runnig app:", error);
  }
});
