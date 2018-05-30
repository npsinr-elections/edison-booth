
import crypto = require("crypto");
import express = require("express");
import session = require("express-session");
import morgan = require("morgan");
import nunjucks = require("nunjucks");

import { config } from "../config";
import { router as externalRouter } from "./routes/externalRouter";
import { router as mainRouter } from "./routes/mainRouter";
import { router as userRouter } from "./routes/userRouter";

export const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: crypto.randomBytes(64).toString("hex"),
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.set("views", config.static.views);

nunjucks.configure(app.get("views"), {
  autoescape: true,
  noCache: true,
  express: app
});

app.use("/assets", express.static(config.static.assets));
app.use("/images", express.static(config.database.images));

app.use("/", mainRouter);
app.use("/users", userRouter);
app.use("/external", externalRouter);

export function runServer(callBack: () => void): void {
  app.listen(config.port, callBack);
}
